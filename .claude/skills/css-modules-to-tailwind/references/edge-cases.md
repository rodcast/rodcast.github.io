# Edge cases — the patterns that break naive migrations

Read this before migrating. Each section is a place where a literal translation
produces wrong output. Examples use realistic React/CSS-Module code.

## Table of contents

1. Dynamic & composed classNames
2. Media queries → `max-*` variants (mobile-first trap)
3. Sibling / checked selectors → `peer`
4. Child & descendant selectors
5. Pseudo-elements (`:before`/`:after`) and font-icon content
6. `@keyframes` and animations
7. Theming / dark mode / runtime CSS variables
8. The `@apply` / `@utility` escape hatch
9. SCSS modules (`composes`, nesting, `&`, variables)
10. `:global`, multiple classes, and gotchas
11. Cascade layers — kept resets must live in `@layer base`

---

## 1. Dynamic & composed classNames

CSS Modules get referenced many ways. Preserve the _structure_; swap only the
module reference for the utility string.

```tsx
// Template literal mixing two modules + a font variable:
<i className={`${fontello.variable} ${icon.sun} ${styles.icon__sun}`} />
// → keep the font variable, expand icon.sun and styles.icon__sun:
<i className={`${fontello.variable} before:content-['\\e801'] absolute top-1 left-1 z-0`} />

// clsx / classnames:
className={clsx(styles.btn, isActive && styles.active)}
// → className={clsx('px-4 py-2 rounded-md', isActive && 'bg-black text-white')}

// Conditional ternary:
className={open ? styles.open : styles.closed}
// → className={open ? 'block' : 'hidden'}
```

When a long utility string is used conditionally, a readable pattern is to hoist
the strings to `const` above the JSX. Don't over-engineer — inline is fine for
short ones.

## 2. Media queries → `max-*` variants (the mobile-first trap)

Tailwind variants are **min-width** by default. A `max-width` media query must
become a `max-*` variant or the breakpoint inverts.

```css
@media (max-width: 768px) {
  .switch {
    top: 28px;
  }
}
```

`max-width: 768px` ≈ Tailwind's `md` boundary → use **`max-md:`**:

```tsx
<label className="... top-[50px] max-md:top-7" />
```

- `max-width: 640px` → `max-sm:`
- `max-width: 768px` → `max-md:`
- `max-width: 1024px` → `max-lg:`
- A non-standard breakpoint → arbitrary: `max-[900px]:flex-col`.

`min-width: 768px` → plain `md:`. **Always re-check direction per query** — this
is the most common silent regression.

## 3. Sibling / checked selectors → `peer`

The classic toggle: a hidden checkbox styles its sibling.

```css
.slider {
  background: var(--contrast-color);
}
input[type='checkbox']:checked + .slider {
  background: var(--secondary-color);
}
input[type='checkbox']:checked + .slider:before {
  transform: translateX(34px);
}
```

Mark the controlling input `peer`, style siblings with `peer-checked:`:

```tsx
<input type="checkbox" className="peer sr-only" />
<span className="bg-[var(--contrast-color)] peer-checked:bg-[var(--secondary-color)]
                 before:translate-x-0 peer-checked:before:translate-x-[34px]" />
```

`peer` requires the styled element to be a **later sibling** of the peer (matches
`+`/`~`). For parent-state styling use `group` / `group-hover:` instead.

## 4. Child & descendant selectors

```css
.logo > span {
  display: none;
} /* hide a specific child */
```

Two options, prefer the first when you control the markup:

- Move the utility onto the child: `<span className="hidden">`.
- Arbitrary variant on the parent: `className="[&>span]:hidden"`.

Descendant (`.card .title`) → `[&_.title]:…` or, better, put the class on the
title element. Deep selector chains are a smell — restructuring to put classes
where they belong is usually cleaner than nesting arbitrary variants.

## 5. Pseudo-elements and font-icon content

`:before`/`:after` map to `before:`/`after:` variants. Tailwind auto-injects
`content: ''` when you use `before:`, but set it explicitly when there's real
content. **Content must be quoted inside the bracket and unicode escapes need a
doubled backslash in TSX strings.**

```css
.github:before {
  content: '\f09b';
  font-family: var(--font-fontello);
}
```

```tsx
<i
  className="before:content-['\\f09b'] before:font-[var(--font-fontello)]
              before:inline-block before:w-10 before:h-10 before:leading-10
              before:text-center before:text-[2rem]"
/>
```

This is verbose. Font-icon classes reused across many elements are a legitimate
case for an `@utility` (section 8) — converting to that is still "off CSS
modules" and keeps markup clean. Decide based on repetition.

## 6. `@keyframes` and animations

Keyframes can't be inlined. In v4, define them in the global stylesheet's
`@theme` block, which generates an `animate-*` utility:

```css
/* globals.css */
@theme {
  --animate-fade-bg: fade-bg 0.4s ease-in-out;
  @keyframes fade-bg {
    0%,
    100% {
      background-color: transparent;
    }
    50% {
      color: var(--primary-color);
      background: var(--secondary-color);
    }
  }
}
```

```tsx
// .logo:hover { animation: fadeInOutBackground 0.4s ...; }  →
<h1 className="hover:animate-fade-bg" />
```

Keep the `@keyframes` definition; only its _trigger_ moves to a utility.

## 7. Theming / dark mode / runtime CSS variables — read carefully

This is where migrations most often break subtly. If the project swaps CSS
variable _values_ at runtime (theme toggle), those variables must stay live CSS
custom properties — **never freeze them into static `@theme` colors.**

Pattern in this kind of project:

```css
:root {
  --primary-color: #fff;
  --secondary-color: #1c1c1c;
}
html[data-theme='dark'] {
  --primary-color: #1c1c1c;
  --secondary-color: #fff;
}
```

Migration:

- **Keep** the `:root` and `html[data-theme='dark']` blocks exactly as-is in the
  global stylesheet. They are the theme engine.
- Reference the variables from utilities with arbitrary values:
  `bg-[var(--primary-color)] text-[var(--secondary-color)]`. Because the
  variable is resolved at runtime, theme switching keeps working for free.
- If the project uses `prefers-color-scheme` or a `.dark` class instead, you can
  use Tailwind's `dark:` variant — but only when colors are otherwise static.
- For a non-standard trigger like `[data-theme='dark']`, register a variant so
  `dark:` works if you want it:
  ```css
  @custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
  ```

Decision rule: **does any selector override this variable's value?** If yes, it's
a runtime variable — keep it as a CSS custom property. If no, it's a static
token and may go in `@theme`.

## 8. The `@apply` / `@utility` escape hatch

The goal is inline utilities, but two cases justify a named class — and both
still remove the `.module.css` file, so they satisfy "off CSS Modules":

- **Reused complex pattern** (a font-icon glyph set, a button style on 8 sites).
- **Markup you can't edit** (rendering raw HTML, `dangerouslySetInnerHTML`,
  third-party DOM) where you can't attach classes to elements.

v4 syntax in the global stylesheet:

```css
@utility btn {
  @apply px-4 py-2 rounded-md font-semibold border border-[var(--secondary-color)];
}
```

Use sparingly. If you find yourself `@apply`-ing everything, the migration isn't
really moving to utilities — prefer inlining.

## 9. SCSS modules (`.module.scss`)

- **`composes: base from './x.module.scss'`** → there's no Tailwind equivalent;
  inline the composed class's utilities at every use site, or make an `@utility`.
- **Nesting / `&`** → flatten. `&:hover` → `hover:`; nested `.child` → move class
  to the child or use `[&_.child]:`.
- **SCSS variables / mixins / functions** (`$color`, `@mixin`, `lighten()`) →
  resolve to concrete values first (compute the final CSS), then map. Tailwind
  has no build-time SCSS; don't try to preserve the SCSS abstractions.
- After migration, the file is plain enough to delete along with its import.

## 10. `:global`, multiple classes, and gotchas

- `:global(.foo)` in a module targets a global class — that styling likely
  belongs in the global stylesheet or as utilities on the element; don't lose it.
- A rule with **multiple selectors** (`.accept:hover, .reject:hover { opacity: .85 }`)
  → apply `hover:opacity-[0.85]` to _both_ elements.
- **`*` universal / element resets** (`* { margin: 0 }`, `a { color: inherit }`)
  live in the global stylesheet, not a module — usually leave them, or let
  Tailwind's preflight handle resets. Don't try to inline a `*` selector.
- **Specificity**: utilities are flat; if old CSS relied on cascade order,
  verify the visual result rather than assuming the class order matches.

## 11. Cascade layers — kept resets must live in `@layer base`

The highest-impact silent regression in a v4 migration, and the easiest to miss
because it **compiles clean**. `@import "tailwindcss"` puts every utility inside
`@layer utilities`. By the CSS cascade-layers rule, **an unlayered rule beats any
layered rule regardless of specificity** — so a global reset left unlayered in
`globals.css` overrides your utilities site-wide.

```css
@import 'tailwindcss';
* {
  margin: 0;
  padding: 0;
} /* unlayered → beats .mt-8, .p-8, .mx-8 … */
a {
  text-decoration: none;
} /* unlayered → beats .underline */
```

Symptom: not one broken component but **whole-page** collapse of whatever the
reset touches — all spacing gone, all underlines gone — while colors, borders,
grid, and fonts (which the reset doesn't touch) look fine. That "only margins and
underlines are wrong, everywhere" signature is the fingerprint.

Fix — move the project's base element rules into `@layer base`:

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
  ol,
  ul {
    list-style: none;
  }
}
```

Keep unlayered on purpose: `:root` / `[data-theme]` **custom-property** blocks
(no conflict with utilities) and deliberate always-win helpers like `.sr-only`.
Full recipe and rationale in `tailwind-v4-setup.md` → "Cascade layers". This is
exactly what the Phase 3 visual diff is built to catch — if spacing looks
collapsed in the `new` screenshot but the build was green, suspect this first.
