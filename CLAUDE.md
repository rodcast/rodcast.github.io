# CLAUDE.md

Quick reference for Claude AI. The full project guide (commands, constraints, conventions, Git workflow) is imported below — this file only adds Claude-specific quick-reference details not already covered there.

@AGENTS.md
@.claude/rules/git-workflow.md

## Delegation & Model Policy

- **Before delegating, verify that an agent is necessary.** Handle simple, focused tasks directly.
- Use agents only when they provide clear value, such as multi-file investigation, isolated research, or parallelizable work.
- **Always use the lowest-cost model below Opus that can complete the task reliably.** Do not default or escalate to Opus without clear justification.
- Use Opus only when the task genuinely requires advanced reasoning, complex implementation, difficult debugging, architecture decisions, or high-risk review.
- Use a low-cost model for simple, mechanical tasks, including Git workflow operations such as creating branches, commits, pushes, and pull requests. See `AGENTS.md` → **Git Workflow**.
- Keep delegated tasks narrowly scoped and review the agent’s output before applying any changes.

## Claude-Specific Notes

- `yarn dev` sets `NODE_TLS_REJECT_UNAUTHORIZED=0` (local-only TLS bypass for development).
- CSS Modules for all component styles; globals only in `src/styles/globals.css` (resets, CSS custom properties, and a few a11y utilities such as `.sr-only`).
- `.mcp.json` registers the `next-devtools` MCP server for this project.
- Project skills live in `.claude/skills/` (`verify-project`, `check-discovery-consistency`, `new-component`); `.claude/agents/static-export-guardian.md` reviews diffs for static-export breakage.

## Path Aliases (tsconfig.json)

| Alias            | Resolves to               |
| ---------------- | ------------------------- |
| `@/*`            | `src/*`                   |
| `@/components/*` | `src/components/*`        |
| `@/constants/*`  | `src/shared/constants/*`  |
| `@/interfaces/*` | `src/shared/interfaces/*` |
| `@/types/*`      | `src/shared/types/*`      |
| `@/utils/*`      | `src/shared/utils/*`      |

Use aliases for anything outside the current directory — never `../` traversal. Same-directory siblings are imported relatively (`./SocialLinks`), and `next/font/local` asset paths must stay relative.

## Data Flow

```text
getStaticProps (build time)
  → Promise.allSettled([fetchData(GITHUB_API), fetchData(MEDIUM_API)])
      (src/shared/utils/fetch.ts — 5s timeout; rejected source → [])
  → normalizeGitHub / normalizeMedium (src/shared/utils/)
  → Page props → Article (next/dynamic) → GitHub + Medium
```
