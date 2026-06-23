---
name: css-modules-to-tailwind
description: >-
  Migrate CSS Modules to Tailwind CSS v4 in a Next.js/React/TypeScript project —
  rewrite every `*.module.css`/`*.module.scss` rule into Tailwind utilities,
  update all component `className` references (including template literals,
  clsx/classnames, and composed multi-module class strings), preserve the exact
  rendered UI and runtime behavior, delete the orphaned module files, and
  validate with build + typecheck plus a class-by-class audit report. Use this
  whenever the user wants to convert, migrate, port, or move styles off CSS
  Modules onto Tailwind (or "tailwindify" / "drop CSS modules" / "replace
  *.module.css"), set up Tailwind v4 in a project that currently uses CSS
  Modules, or modernize a component's styling to utility classes — even if they
  only mention one component or don't say "Tailwind v4" explicitly.
---

# CSS Modules → Tailwind CSS v4 Migration

## What this skill does and why it's shaped this way

Converting CSS Modules to Tailwind looks like a find-and-replace job but isn't.
The danger is silent visual regressions: a `max-width` media query that becomes a
`min-width` utility, a sibling selector that loses its relationship, a CSS
variable that was being swapped at runtime for theming and gets frozen into a
static value, or a kept global reset (`* { margin: 0 }`) that sits _outside_
Tailwind's cascade layers and silently overrides every spacing utility. The
output compiles and _looks_ done, but the UI shifted.

So the whole approach is built around one idea: **preserve observable behavior
exactly, prove it component-by-component, and never delete a source of truth
until its replacement compiles clean.** "Compiles clean" is necessary but not
sufficient — the build passing tells you nothing about whether pixels moved, so
the migration isn't done until you've _diffed the rendered output_ against the
original (Phase 3). Aggressive utility conversion (the goal: no `.module.css`
files left) is safe only when paired with that discipline.

Work in this order. Each phase exists to shrink the blast radius of a mistake.

## Who runs this (recommended agent)

Run this skill **end-to-end with the `general-purpose` agent on a capable model
(Opus)** — do not fan it out across subagents and do not drop the driver to a
low-cost model. Two reasons:

- **Tooling.** The migration must read and _edit_ source, run the discovery
  script, `tsc`/build, a git worktree, and headless-Chrome screenshots — it needs
  the full `Read`/`Write`/`Edit`/`Bash`/`Grep`/`Glob` set. That rules out every
  read-only agent (`Explore`, `Plan`, and the `static-export-guardian` review
  agent). `general-purpose` is the purpose-built multi-step executor with all
  tools; the generic `claude` catch-all works too but isn't the specialized fit.
- **Risk.** This skill exists to prevent regressions that _compile clean_ —
  inverted media queries, a runtime theme variable frozen static, an unlayered
  reset beating every utility, pixels that moved under a green build. Those are
  judgment calls (Phase 1 cascade-layer/theme-token decisions, Phase 3
  visual-diff adjudication), held across many files with tight cross-phase state
  (the baseline ref, the running per-component mapping). Per this repo's
  delegation policy (`CLAUDE.md`), that is exactly the "complex implementation +
  high-risk review" tier where Opus is justified; a cheaper driver would trade
  away the very safety this skill is built to provide.

**Keep cost down where it's free to:** the bounded, read-only pieces stay
low-cost — the deterministic `discover.mjs` + verify gate need no model judgment,
and the Phase 3 static-export/deploy check is already delegated to the
**`static-export-guardian`** agent (read-only, `sonnet`). That is where "prefer a
low-cost agent" applies without compromising quality; the reasoning-heavy driver
is not.

## Phase 0 — Discover and plan

Run the discovery script to map the work before touching anything:

```bash
node <skill-dir>/scripts/discover.mjs
```

> **Limitation:** the discovery script detects only static ES `import` statements.
> Dynamic imports (`await import('./foo.module.css')`) and `require()` calls are
> invisible to it. After running the script, also run:
> `grep -r 'module\.css' src/ --include='*.ts' --include='*.tsx'`
> to catch any the script missed.

It lists every `*.module.css` / `*.module.scss` file, the components that import
each, how the import is aliased (`styles`, `icon`, …), and flags files that
share a module across multiple components (migrate those together). Read its
output, then read `references/edge-cases.md` so you recognize the hard patterns
_before_ you hit them.

Establish a baseline so you can prove nothing broke:

```bash
# Use the project's own verify command if it has one (check package.json / AGENTS.md).
# Otherwise the generic gate:
npx tsc --noEmit && <project build command>
```

**Capture a visual baseline now**, while the original styling is still intact —
this is the only "before" you'll get to diff against in Phase 3. The simplest,
git-based option needs no up-front screenshots: just note the pre-migration
commit (`git rev-parse HEAD`) so Phase 3 can build that ref in a worktree and
screenshot it. If the original is _not_ in git (uncommitted), screenshot the key
pages/states now (see Phase 3 for the headless-Chrome recipe) and save them under
e.g. `/tmp/vrt/old-*.png`. Either way, list the **distinct visual states** worth
checking — at minimum desktop + mobile widths, plus light/dark theme and any
toggle/hover/expanded states unique to the components in scope.

Decide an order: **leaf/presentational components first, shared/global last.**
Migrate the smallest, least-depended-on component first to validate your setup
before risking a widely-used one.

Present the plan to the user (files, order, anything that can't become a pure
utility) and confirm before bulk edits — especially before touching global
styles or theme tokens.

Also flag any component that **accepts a `className` prop** (forwarding it to the
root element alongside module classes). Those merges must survive the migration:
``className={`${styles.base} ${props.className}`}`` becomes
``className={`flex gap-4 ${props.className ?? ''}`}``. If `clsx` was used only for
that merging and you remove it, verify the forwarding still works.

## Phase 1 — Set up Tailwind v4 (only if not already present)

Check first: look for `@import "tailwindcss"` and `tailwindcss` in
`package.json`. If Tailwind v4 is already wired up, skip to Phase 2. If a v3
config (`tailwind.config.js` + `content` globs) exists, read
`references/tailwind-v4-setup.md` → "Upgrading from v3" before changing anything.

Otherwise install and configure v4 following `references/tailwind-v4-setup.md`.
The short version for Next.js:

1. `npm i -D tailwindcss @tailwindcss/postcss` (or the project's package manager).
2. Add the PostCSS plugin. Check for an **existing** PostCSS config in any of
   `postcss.config.js`, `postcss.config.mjs`, or `postcss.config.cjs` — add the
   plugin there rather than creating a new file, because a duplicate config will
   silently shadow the original. If none exists, create `postcss.config.mjs` with
   `{ plugins: { '@tailwindcss/postcss': {} } }`.
3. Put `@import "tailwindcss";` at the top of the global stylesheet (e.g.
   `src/styles/globals.css`) — the one already imported in `_app`.

**Optional but recommended — Prettier Tailwind plugin.** If the project uses
Prettier (check for `.prettierrc` or `prettier` in `package.json`), install
`prettier-plugin-tailwindcss` now — before converting any component — so every
class string lands sorted in canonical order from the start:

```bash
npm i -D prettier-plugin-tailwindcss
# then add "plugins": ["prettier-plugin-tailwindcss"] to .prettierrc
```

Sorted strings are dramatically easier to review and eliminate an entire class of
"wrong order" mistakes.

**Cascade layers — the regression that compiles clean and still breaks the whole
page.** Tailwind v4 puts every utility inside `@layer utilities`. Per the CSS
cascade-layers rule, **any unlayered declaration beats any layered one regardless
of specificity.** So existing global rules left _below_ the `@import` (a
`* { margin: 0; padding: 0 }` reset, `a { text-decoration: none }`, element
resets) will silently override `p-8`, `mt-8`, `mx-8`, `underline`, and every
other utility you write — the build passes, but spacing and decorations collapse
across the entire site. **Wrap the project's kept base/reset element rules in
`@layer base`** (the same layer Tailwind's preflight uses) so utilities can win:

```css
@layer base {
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  /* …other element/reset rules… */
}
```

Leave `:root`/theme-selector **custom-property** blocks unlayered (they don't
conflict with utilities), and leave intentional always-win helpers like
`.sr-only` unlayered on purpose. See `references/tailwind-v4-setup.md` →
"Cascade layers" and `references/edge-cases.md` → "Cascade layers".

**Theme tokens — the most important decision in this phase.** Read the global
stylesheet's `:root` custom properties. There are two kinds and they migrate
differently:

- **Static design tokens** (a spacing scale, fixed brand colors) → move into an
  `@theme { … }` block so they generate utilities (`--color-brand` → `bg-brand`).
- **Runtime-swapped variables** (anything overridden under a selector like
  `html[data-theme='dark']`, `.dark`, or a `prefers-color-scheme` block) →
  **keep them as plain CSS custom properties.** `@theme` tokens are static; if
  you bake them in, theme switching silently breaks. Reference them from
  utilities via arbitrary values, e.g. `bg-[var(--primary-color)]`, or register
  the variable name in `@theme` while leaving the _overrides_ in normal CSS.
  Map the project's theming trigger to the right Tailwind variant (a
  `[data-theme='dark']` attribute needs a custom `@custom-variant`, not the
  default `dark:`). `references/edge-cases.md` → "Theming" has the recipes.

Verify the build still passes before migrating a single component.

## Phase 2 — Migrate one component at a time

For each CSS module, smallest first, do this full loop before moving on:

1. **Read** the `.module.css` file and _every_ component that imports it.
2. **Map** each class to utilities using `references/mapping.md`. Preserve exact
   values — when a value isn't on Tailwind's default scale, use an arbitrary
   value (`top-[50px]`, `w-[68px]`, `gap-[var(--space-x-2)]`) rather than
   rounding to the nearest utility. Approximation is how regressions creep in.
3. **Rewrite the markup.** Replace each `className={styles.foo}` with the mapped
   utilities. Handle the real-world shapes (see `references/edge-cases.md`):
   - Template literals combining modules + props:
     ``className={`${styles.a} ${icon.b}`}`` → merge both classes' utilities.
   - `clsx` / `classnames` / conditional expressions → keep the conditional
     structure, swap module references for utility strings.
   - **Dynamic bracket access** (`styles[variantKey]`) — cannot be translated
     mechanically; expand into a lookup map:
     `const cls = { primary: 'bg-blue-600', danger: 'bg-red-600' };`
     then `className={cls[variantKey]}`.
   - **`className` prop forwarding** — if the component merges a module class
     with an incoming prop, preserve the merge:
     ``className={`${styles.base} ${props.className ?? ''}`}``
     → ``className={`flex gap-4 ${props.className ?? ''}`}``
   - A class used by several elements → expand it at each site (or, if it's
     genuinely repeated and complex, see the `@apply`/`@utility` escape hatch in
     `references/edge-cases.md` — use sparingly; inline utilities are the goal).
4. **Translate the hard selectors** — don't drop them:
   - `:hover` `:focus` `:active` `:disabled` → `hover:` `focus:` etc.
   - `:focus-visible` → `focus-visible:`; `:focus-within` → `focus-within:`.
     **Don't collapse `:focus-visible` into plain `focus:` —** the distinction
     matters for accessibility: `:focus-visible` shows the ring only for keyboard
     navigation, not mouse clicks.
   - `:has(input:checked)` → `has-[input:checked]:` (full browser support in v4).
   - `:before` / `:after` → `before:` / `after:` (content via `content-['…']`).
   - Sibling/checked patterns (`input:checked + .slider`) → the `peer` pattern
     (`peer` on the input, `peer-checked:` on the sibling).
   - Child/descendant (`.logo > span`) → arbitrary variants (`[&>span]:hidden`)
     or move the class onto the child element directly.
   - `@media (max-width: …)` → **`max-*` variants** (`max-md:flex-col`).
     Tailwind is mobile-first; a plain `md:` would invert the breakpoint. This
     is the single most common silent regression — double-check every media
     query's direction.
   - `@keyframes` → define the animation in `@theme` (`--animate-…`) per
     `references/edge-cases.md`.
5. **Verify incrementally:** run typecheck (and a build if quick) after each
   component. Catching a break here localizes it to the file you just touched.
   If a browser tab is available, load the component's page/state before moving
   on — an eyeball catches obvious regressions early and avoids hunting through
   10 components at Phase 3 for a Phase 2 mistake.
6. **Record** the mapping immediately — open `tailwind-migration-report.md` and
   append that component's table right after deleting its module file, before
   moving to the next component. Building the report incrementally is safer than
   reconstructing from memory at Phase 3 and less likely to leave gaps.
7. **Delete** the now-orphaned `.module.css` file and remove its import — but
   only once the importing component(s) compile with no remaining references to
   it. Confirm with a quick grep that no `styles.` (or the alias) usage remains.

   **Mid-migration rollback:** if the tree is in a broken intermediate state,
   the module file is the source of truth until deleted — restore it from git
   (`git checkout HEAD -- path/to/foo.module.css`) and revert the component.
   For a full reset: `git reset --hard <pre-migration-ref>`. This is why Phase 0
   requires a dedicated branch and a recorded baseline SHA.

## Phase 3 — Validate and report

1. **Full verify gate** — run the project's complete check. Resolve every error;
   "looks done" is not done. Generic fallback:
   ```bash
   npx tsc --noEmit && <lint> && <build>
   ```
   **Delegate a static-export/deploy review before opening the PR.** This
   migration adds dependencies (`tailwindcss`, `@tailwindcss/postcss`), a
   `postcss.config.mjs`, and changes the build pipeline — the kind of change that
   can silently break a static export (`output: 'export'` → `out/`) or the host
   deploy. If the project ships a build/deploy-guard subagent, hand it the diff.
   In this repo that's the **`static-export-guardian`** agent (read-only,
   `sonnet`) — its remit is precisely "after implementing a change and before
   opening a PR, or whenever a change touches `next.config.mjs`, data fetching,
   dependencies, or the discovery metadata surface." Run it, resolve anything it
   flags, then proceed.
2. **Confirm the migration is complete** — no module files or imports left
   behind:
   ```bash
   node <skill-dir>/scripts/discover.mjs --check
   ```
   It exits non-zero and lists offenders if any `*.module.{css,scss}` file or
   import remains. A clean exit is your proof the conversion is total.
   Also locate the TypeScript CSS module declaration file (commonly
   `src/shared/types/css.d.ts` or any `*.d.ts` containing
   `declare module '*.module.css'`): now that all modules are deleted it is dead
   code and may be removed — but confirm no `.module.scss` or other module variant
   is still in use before doing so.
3. **Prove it visually — diff the rendered output against the original, then fix
   every difference.** A clean build says nothing about whether pixels moved.
   Render both versions and compare them image-by-image:

   ```bash
   # a) Build & serve the MIGRATED app. (Static-export shown; for an SSR/dev
   #    project, start the prod or dev server instead and serve its URL.)
   <build>; (python3 -m http.server 8731 --directory out &)

   # b) Build & serve the ORIGINAL from the pre-migration ref in a worktree
   #    (needs its own install — a symlinked node_modules breaks some bundlers).
   git worktree add /tmp/vrt-old <pre-migration-ref>
   ( cd /tmp/vrt-old && <install> && <build> )
   (python3 -m http.server 8732 --directory /tmp/vrt-old/out &)

   # c) Screenshot both at each width. Prefer Playwright if available
   #    (cross-platform and handles interaction states natively):
   mkdir -p /tmp/vrt
   npx playwright screenshot --full-page http://localhost:8731/ /tmp/vrt/new-1280.png
   npx playwright screenshot --full-page http://localhost:8732/ /tmp/vrt/old-1280.png
   # Repeat at mobile width (390) by adding --viewport-size=390,900

   # Headless-Chrome fallback (resolve binary per platform):
   CHROME=$(\
     command -v \
       "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
       google-chrome chromium-browser chromium 2>/dev/null | head -1)
   for w in 1280 390; do
     "$CHROME" --headless=new --hide-scrollbars --window-size=$w,2600 \
       --screenshot=/tmp/vrt/new-$w.png "http://localhost:8731/"
     "$CHROME" --headless=new --hide-scrollbars --window-size=$w,2600 \
       --screenshot=/tmp/vrt/old-$w.png "http://localhost:8732/"
   done

   # d) Cleanup — always kill the servers (they bind ports 8731/8732 and will
   #    conflict with any future run if left alive) and remove the worktree:
   kill $(lsof -t -i:8731 -i:8732) 2>/dev/null || true
   git worktree remove --force /tmp/vrt-old
   ```

   Open each `old`/`new` pair and compare carefully — desktop **and** mobile, plus
   every state you listed in Phase 0. Theme and interaction states (dark mode, a
   `:checked` toggle, an expanded `<details>`) can't be reached by a bare
   screenshot: drive them with Playwright/Puppeteer (set `localStorage`/the theme
   attribute, click, then capture) or temporarily hardcode the state to render it.

   **For every mismatch, adjust the Tailwind to match the original** — don't
   rationalize it away. The usual culprits, in rough order of likelihood:
   - An **unlayered global rule** beating utilities → move it into `@layer base`
     (Phase 1 / `references/edge-cases.md` → "Cascade layers"). Tell-tale: spacing
     or text-decoration collapses _site-wide_, not in one component.
   - A **media query whose direction inverted** (`max-*` vs `min-*`).
   - An **arbitrary value rounded** to a near scale step → restore the exact value.
   - A **runtime theme variable frozen** into a static color → back to `var(--…)`.
   - Tailwind **preflight** changing an element default the old CSS relied on (e.g.
     heading sizes, `button`/`list` resets) → add the explicit utility/base rule.

   Re-render and re-diff until the pair matches. Distinguish a **real regression**
   from an **intentional/environment-driven difference** (e.g. a cookie banner that
   only renders when an analytics env var is set at build time) — note the latter
   so it isn't chased, but don't use "probably fine" to wave off a real shift.
   Cleanup is in step d above.

4. **Produce the class-audit report** (`tailwind-migration-report.md` at repo
   root) so the human can review the mapping without diffing every file. Use
   this structure:

   ```markdown
   # CSS Modules → Tailwind migration

   ## Summary

   - Components migrated: N
   - Module files removed: N
   - Tailwind set up: yes/no (version)

   ## Per-component mapping

   ### Toggle (src/styles/toggle.module.css → removed)

   | Old class                 | Tailwind utilities                                            |
   | ------------------------- | ------------------------------------------------------------- |
   | `.switch`                 | `absolute top-[50px] right-[var(--space-x-2)] … max-md:top-7` |
   | `input:checked + .slider` | `peer` + `peer-checked:bg-[var(--secondary-color)]`           |

   ## Non-trivial conversions (review these)

   - Header `@keyframes fadeInOutBackground` → `@theme --animate-fade-…`; reason: keyframes can't be inlined.
   - Icon `:before { content: '\f09b' }` font-icon glyphs kept via `before:content-['\f09b']`.

   ## Theming

   - How dark mode / runtime variables were preserved.

   ## Visual verification

   - States diffed (widths, themes, interaction states) and the result.
   - Any regression found and how it was fixed (e.g. moved reset into `@layer base`).
   - Any intentional/env-driven difference noted as NOT a regression.
   ```

5. **Report honestly.** Show the verify output as evidence, including the
   visual-diff result (matched / what was fixed). If a rule couldn't become a pure
   utility (rare, legitimate cases exist — see edge-cases), say so and explain
   where it lives now, rather than silently approximating. Never report a
   migration as done on a green build alone — "compiles" is not "looks right."

## Safety principles (the spirit of the skill)

- **One component at a time, verify between each.** Smallest reversible steps.
- **Exact values over close-enough.** Arbitrary values exist for this reason.
- **Compiling is not matching.** Prove it visually — diff the rendered output
  against the original and fix every difference. A green build hides moved pixels.
- **Keep kept globals in `@layer base`.** An unlayered reset overrides every
  utility on the page and the build still passes.
- **Never freeze a runtime variable.** Preserve the theming mechanism first.
- **Don't delete until it compiles clean.** The module file is the source of
  truth until the utilities replace it provably.
- **The report is part of the deliverable**, not an afterthought — it's how the
  human trusts the migration without re-reading every diff.

## Reference files

- `references/mapping.md` — CSS property/value → Tailwind v4 utility cheatsheet,
  including arbitrary-value syntax and the default scale.
- `references/edge-cases.md` — composed/dynamic classNames, `peer` sibling
  patterns, `max-*` media queries, keyframes, pseudo-elements, theming/dark
  mode, cascade layers (`@layer base` for kept resets), `@apply`/`@utility`
  escape hatches, SCSS-specific notes.
- `references/tailwind-v4-setup.md` — installing/configuring Tailwind v4 in
  Next.js, `@theme` tokens, custom variants, cascade layers, and upgrading from
  v3.
