# Claude Code

Project-wide rules are in [`AGENTS.md`](AGENTS.md).

@AGENTS.md

## Repository Configuration

- `.mcp.json` registers the `next-devtools` MCP server.
- Project workflows are in `.claude/skills/`: `verify-project`,
  `check-discovery-consistency`, and `new-component`.
- `.claude/agents/static-export-guardian.md` reviews static-export and
  deployment risks.
- `.claude/settings.json` configures editing hooks and Git guards. If a hook
  blocks an operation, report the denial; do not bypass or disable it.
- Keep `README.md` focused on setup and use, `DESIGN.md` on implemented
  architecture, and `AGENTS.md` on contributor rules. Document current
  behavior, not planned changes.
