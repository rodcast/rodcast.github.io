# Tailwind v4 setup in Next.js

Tailwind v4 is **CSS-first**: configuration lives in your CSS via `@import` and
`@theme`, not a big `tailwind.config.js`. There are no `content` globs to
maintain — v4 auto-detects template files.

## Fresh install (project has no Tailwind)

1. **Install** (match the project's package manager — check for
   `yarn.lock` / `pnpm-lock.yaml` / `package-lock.json`):

   ```bash
   npm i -D tailwindcss @tailwindcss/postcss
   # yarn add -D tailwindcss @tailwindcss/postcss
   ```

2. **PostCSS plugin.** Create or edit `postcss.config.mjs`:

   ```js
   const config = { plugins: { '@tailwindcss/postcss': {} } };
   export default config;
   ```

   (If a `postcss.config.js` already exists, add the plugin there; don't create a
   duplicate config.)

3. **Import Tailwind** at the very top of the global stylesheet that's already
   imported once in `_app.tsx` (commonly `src/styles/globals.css`):

   ```css
   @import 'tailwindcss';
   ```

   Keep the file's existing global rules below the import.

4. **Verify** the build before migrating components:
   ```bash
   npx tsc --noEmit && <project build command>
   ```

No `tailwind.config.js` is required for v4. Only add one (via
`@config "./tailwind.config.js";`) if you need a plugin that hasn't moved to the
CSS API.

## Cascade layers — keep kept global styles in `@layer base`

`@import "tailwindcss"` declares `@layer theme, base, components, utilities;` and
puts every generated utility in `@layer utilities`. The CSS cascade-layers rule
is: **unlayered styles beat layered styles regardless of specificity.** So any
plain rule left below the `@import` in your global stylesheet outranks every
Tailwind utility.

This bites hardest with the resets a CSS-Modules project keeps in `globals.css`:

```css
@import 'tailwindcss';

/* WRONG: unlayered — overrides p-8, mt-8, mx-8, underline, … everywhere */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
}
```

The build passes, but margins/paddings/underlines collapse across the whole site
because `* { margin: 0 }` wins over `.mt-8`. Fix: put the project's base element
rules in `@layer base` (where preflight lives), so utilities can override them.

```css
@import 'tailwindcss';

@layer base {
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html,
  body {
    /* … */
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  ol,
  ul {
    list-style: none;
  }
}
```

Leave these **unlayered** on purpose:

- `:root { --x: … }` and theme-selector blocks (`html[data-theme='dark']`) — they
  declare custom properties and don't compete with utilities; layering them can
  perturb token precedence.
- Intentional "always win" helpers like `.sr-only` — you _want_ them to beat
  utilities.

Note: much of a hand-written reset (universal `margin/padding/box-sizing`, `ol/ul`
list-style, heading margins) duplicates Tailwind v4 **preflight**, which already
runs in `@layer base`. You can often delete the redundant parts and keep only the
project-specific rules — but verify visually before removing anything.

## `@theme` — design tokens that generate utilities

`@theme` turns custom properties into utilities. Naming follows namespaces:

```css
@theme {
  --color-brand: #3b82f6; /* → bg-brand, text-brand, border-brand */
  --spacing-gutter: 2rem; /* → p-gutter, gap-gutter, m-gutter */
  --font-display: 'Inter', sans-serif; /* → font-display */
  --breakpoint-3xl: 120rem; /* → 3xl: variant */
  --animate-fade-bg: fade-bg 0.4s ease-in-out; /* → animate-fade-bg */
}
```

Namespaces: `--color-*`, `--spacing-*`, `--font-*`, `--text-*` (font-size),
`--font-weight-*`, `--radius-*`, `--shadow-*`, `--breakpoint-*`, `--animate-*`,
`--ease-*`, `--leading-*`, `--tracking-*`.

**Only put STATIC tokens here.** A value that changes at runtime (theme toggle)
must stay an ordinary CSS variable outside `@theme` — see
`edge-cases.md` section 7. If an existing `:root` has a mix, split it: static
ones into `@theme`, runtime-swapped ones left in `:root`/theme-selector blocks.

You can reference a kept CSS variable inside `@theme` so it still produces a
utility while staying dynamic:

```css
:root {
  --primary-color: #fff;
}
html[data-theme='dark'] {
  --primary-color: #1c1c1c;
}
@theme inline {
  --color-primary: var(--primary-color);
} /* bg-primary stays theme-aware */
```

The `inline` keyword makes the utility emit `var(--primary-color)` rather than
freezing the value — exactly what runtime theming needs.

## Custom variants

```css
/* Make dark: respond to a [data-theme="dark"] attribute instead of media/class */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

## Upgrading from Tailwind v3

If the project already has v3 (`tailwind.config.js` with `content`, `theme`,
`plugins`):

1. Try the official codemod first: `npx @tailwindcss/upgrade`. It migrates config
   to CSS, rewrites deprecated utilities, and updates PostCSS. Review its diff.
2. Manual essentials if not using the codemod:
   - Replace `@tailwind base; @tailwind components; @tailwind utilities;` with a
     single `@import "tailwindcss";`.
   - Move `theme.extend` tokens into `@theme { … }`.
   - Swap the PostCSS plugin `tailwindcss` → `@tailwindcss/postcss`; remove
     `autoprefixer`/`postcss-import` (v4 includes them).
   - Renamed utilities: `shadow-sm`→`shadow-xs`, `shadow`→`shadow-sm`,
     `rounded`→`rounded-sm`, `blur`→`blur-sm`, `outline-none`→`outline-hidden`.
     The codemod handles these; if doing it by hand, grep for the old names.
3. Re-run the build and check for removed-default warnings.

## Static-export / SSG projects

Tailwind v4 produces a plain CSS file at build time with no runtime — fully
compatible with `output: 'export'` and static hosting. Nothing about the
migration adds a server dependency. Don't introduce runtime CSS-in-JS as a
"bridge"; that would break a static export.
