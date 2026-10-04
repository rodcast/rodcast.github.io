---
name: new-component
description: Scaffold a new React component with its paired CSS Module following project conventions (path aliases, strict TypeScript, accessibility baseline). Use when the user asks to create, add, or scaffold a new UI component.
disable-model-invocation: true
---

# New Component

Create a component in `src/components/` with a paired CSS Module in `src/styles/`. Read an existing one (e.g. `src/components/Footer.tsx`) first to match local idiom.

## Conventions

- **CSS Modules only** for component styles; no inline styles or `globals.css` rules.
- **Imports:** `@/styles/*`, `@/components/*`, `@/utils/*`, `@/interfaces/*` across directories, never `../`. Sibling components import relatively (`./SocialLinks`).
- **Strict TypeScript:** explicit props `interface`, no `any`.
- **Design tokens:** use existing CSS custom properties (`var(--space-x-*)`, `var(--text-*)`, `var(--secondary-color)`, ...) instead of hardcoded values.
- **Accessibility:** semantic HTML, `aria-*`/labels where needed, readable fallback text.
- **Formatting:** Prettier rules (see `AGENTS.md`).

## Steps

1. Get the PascalCase component name (e.g. `ProfileCard`).
2. Create `src/styles/<camelCase>.module.css` with a `.content` (or suitable root) class using design tokens.
3. Create `src/components/<PascalCase>.tsx`:

   ```tsx
   import styles from '@/styles/<camelCase>.module.css';

   interface <PascalCase>Props {
     // typed props
   }

   /** <one-line description> */
   export default function <PascalCase>({ ... }: <PascalCase>Props) {
     return <section className={styles.content}>...</section>;
   }
   ```

4. Wire it into its parent: `@/components/<PascalCase>` from a page, or `./<PascalCase>` from a sibling component.
5. Run the `verify-project` skill before declaring done.
