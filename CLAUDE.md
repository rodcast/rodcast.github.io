# CLAUDE.md

Quick reference for Claude AI when working on this codebase. See `AGENTS.md` for the full project guide.

## Essential Commands

```bash
nvm use          # Must run first — loads Node 24.x from .nvmrc
yarn install     # Install dependencies
yarn dev         # Development server (TLS validation disabled)
yarn build       # Static export to out/
yarn lint        # ESLint check (run before completing any task)
yarn lint:fix    # ESLint auto-fix
```

## Critical Constraints

- `output: 'export'` in `next.config.mjs` must stay — site is statically exported to GitHub Pages.
- No SSR-only or runtime server dependencies allowed.
- `trailingSlash: true` and `images.unoptimized: true` must not be removed.

## Path Aliases (tsconfig.json)

| Alias            | Resolves to               |
| ---------------- | ------------------------- |
| `@/*`            | `src/*`                   |
| `@/components/*` | `src/components/*`        |
| `@/constants/*`  | `src/shared/constants/*`  |
| `@/interfaces/*` | `src/shared/interfaces/*` |
| `@/types/*`      | `src/shared/types/*`      |
| `@/utils/*`      | `src/shared/utils/*`      |

Always use aliases — never relative paths.

## Data Flow

```
getStaticProps (build time)
  → fetchData (src/shared/utils/fetch.ts)
  → normalizeGitHub / normalizeMedium (src/shared/utils/)
  → Page props → Article component
```

## Key Conventions

- Normalize all external API data before passing to components.
- When changing an API contract, update both the interface in `src/shared/interfaces/` and its normalizer.
- When editing `public/.well-known/agent-skills/*.md`, update the matching `sha256` in `public/.well-known/agent-skills/index.json`.
- CSS Modules for all component styles; globals only in `src/styles/globals.css`.
- Pre-commit hook runs lint automatically (Husky).
