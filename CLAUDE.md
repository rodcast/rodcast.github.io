# CLAUDE.md

Quick reference for Claude AI. The full project guide (commands, constraints, conventions, Git workflow) is imported below — this file only adds Claude-specific quick-reference details not already covered there.

@AGENTS.md

## Claude-Specific Notes

- `yarn dev` sets `NODE_TLS_REJECT_UNAUTHORIZED=0` (local-only TLS bypass for development).
- CSS Modules for all component styles; globals only in `src/styles/globals.css`.

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

```text
getStaticProps (build time)
  → fetchData (src/shared/utils/fetch.ts)
  → normalizeGitHub / normalizeMedium (src/shared/utils/)
  → Page props → Article component
```
