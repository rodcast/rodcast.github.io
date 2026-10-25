# Git Workflow

Never commit or push directly to `master`; it triggers the GitHub Pages deploy.
Changes intended for the repository should land on a feature branch through a
reviewed pull request.

Only create branches, commits, pushes, or pull requests when the user asks.

Preserve existing user changes and run the applicable verification before
committing. Do not bypass or disable repository hooks. If a hook blocks an
operation, report the denial; this rule does not override executable hooks.

Full details: [`AGENTS.md`](../../AGENTS.md#git-workflow).
