# Git Workflow Rule

The canonical Git workflow lives in [`AGENTS.md`](../../AGENTS.md) → **Git Workflow**. This file is a pointer so the rule loads in Claude Code sessions — keep the details in `AGENTS.md`, not here.

**The rule in one line:** never commit or push directly to `master`; create a feature branch and open a pull request for every change.

`master` is the deployment branch — a push triggers the GitHub Pages build (`.github/workflows/nextjs.yml`), so all changes must land via reviewed PRs. This is also enforced mechanically by the `PreToolUse` guards in `.claude/settings.json`, which deny `git commit` and `git push` while on `master`.
