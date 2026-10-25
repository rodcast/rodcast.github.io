# CLAUDE.md

Claude-specific additions. The full project guide (structure, commands, conventions, verification, Git workflow) is imported below.

@AGENTS.md
@.claude/rules/git-workflow.md

## Delegation & Model Policy

- Handle simple, focused tasks directly; delegate only for clear value (multi-file investigation, isolated research, parallel work).
- Use the lowest-cost model below Opus that can do the task reliably. Reserve Opus for advanced reasoning, complex implementation, hard debugging, architecture decisions, or high-risk review.
- Use a low-cost model for mechanical work such as Git branches, commits, pushes, and PRs (see `AGENTS.md` → **Git Workflow**).
- Keep delegated tasks narrowly scoped and review the output before applying it.

## Claude Code Setup

- `.mcp.json` registers the `next-devtools` MCP server.
- Skills in `.claude/skills/`: `verify-project`, `check-discovery-consistency`, `new-component`.
- Agent `.claude/agents/static-export-guardian.md` reviews diffs for static-export breakage.
- `.claude/settings.json` defines post-edit formatting and TypeScript lint-fix hooks, plus `PreToolUse` guards intended to deny commits and pushes on `master`.
- Hook behavior depends on the host's support for its configuration. If a guard also blocks inspection, validation, or branch creation, report the denial; Markdown authorization does not override executable hooks. Do not bypass or disable the guard.

## Documentation Maintenance

- Keep `README.md` focused on setup and usage, `DESIGN.md` on implemented architecture, and `AGENTS.md` on contributor rules.
- Document current behavior, not planned improvements. Keep static-image optimization, theme defaults, build-time data fallbacks, and optional analytics behavior accurate.
- Follow `AGENTS.md` for verification; report blocked commands without claiming a successful build.
