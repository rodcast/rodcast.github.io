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
- `PreToolUse` guards in `.claude/settings.json` deny `git commit` and `git push` on `master`.
