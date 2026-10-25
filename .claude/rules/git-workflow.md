# Git Workflow Rule

Never commit or push directly to `master`; create a feature branch and open a pull request for every change.

When the user requests it, the agent is authorized to create a feature branch, commit changes, push that branch, and open a pull request. The `master` protection does not prohibit these actions on a feature branch.

Read-only Git inspection, verification commands, and feature-branch creation are allowed by this policy, including when the current branch is `master`. Preserve existing user changes and run the applicable verification before committing.

`master` triggers the GitHub Pages deploy. The `PreToolUse` guards in `.claude/settings.json` are intended to deny commits and pushes on it. If a host applies these guards to unrelated commands, report the denial rather than bypassing the hook. Updating Markdown alone does not change hook enforcement.

Full details: [`AGENTS.md`](../../AGENTS.md#git-workflow).
