# Git Workflow Rule

Never commit or push directly to `master`; create a feature branch and open a pull request for every change.

`master` triggers the GitHub Pages deploy. The `PreToolUse` guards in `.claude/settings.json` deny `git commit` and `git push` on it. Full details: [`AGENTS.md`](../../AGENTS.md) → **Git Workflow**.
