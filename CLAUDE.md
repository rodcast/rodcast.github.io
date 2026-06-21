# CLAUDE.md

Quick reference for Claude AI. The full project guide (commands, constraints, conventions, Git workflow) is imported below — this file only adds Claude-specific quick-reference details not already covered there.

@AGENTS.md

## Delegation & Model Policy

- **Before delegating, verify whether an agent is necessary.** Handle simple and focused tasks directly.
- Use agents only when they provide clear value — multi-file investigation, isolated research, or parallel work.
- **Always use the lowest-cost model below Opus that can complete the task reliably.** Do not default to Opus or escalate to it without clear justification.
- Use Opus only when the task genuinely requires advanced reasoning, complex implementation, debugging, architecture decisions, or high-risk review.
- Use a low-cost model for simple Git workflow tasks (branches, commits, pushes, pull requests — see `AGENTS.md` → Git Workflow).
- Keep delegated tasks narrowly scoped, and review the agent's output before applying it.

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
