---
name: new-component
description: Scaffold a new React component with its paired CSS Module following project conventions (path aliases, strict TypeScript, accessibility baseline). Use when the user asks to create, add, or scaffold a new UI component.
disable-model-invocation: true
---

# New Component

Create a component in `src/components/` paired with a CSS Module in `src/styles/`, matching the conventions already used across the codebase. Read an existing component (e.g. `src/components/Footer.tsx`) and its module before writing, so the new one matches local idiom.

## Conventions (non-negotiable)

- **CSS Modules for all component styles** — never inline styles or `globals.css` for component-scoped rules.
- **Path aliases only** — `@/styles/*`, `@/components/*`, `@/utils/*`, `@/interfaces/*`. Never relative paths.
- **Strict TypeScript** — type all props via an explicit `interface`; no `any`.
- **Design tokens** — use the CSS custom properties already in the modules (`var(--space-x-*)`, `var(--text-*)`, `var(--secondary-color)`, …) rather than hardcoded values.
- **Accessibility** — semantic HTML, `aria-*`/labels where needed, readable fallback text.
- **Formatting** — 2-space indent, single quotes, semicolons, trailing newline (Prettier enforces this on save).

## Steps

1. Ask for (or infer) the component name in PascalCase, e.g. `ProfileCard`.
2. Create `src/styles/<camelCase>.module.css` with a `.content` (or appropriate root) class using design tokens.
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

4. Wire it into its parent page/component using the path alias import.
5. Verify with the `verify-project` skill (lint, Prettier, typecheck, build) before declaring done.
