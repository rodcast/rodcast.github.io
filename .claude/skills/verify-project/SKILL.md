---
name: verify-project
description: >-
  Run project verification before a PR or when asked to verify or validate
  changes. Markdown-only changes need format and link checks; application
  changes need lint, Prettier, typecheck, and a static build.
---

# Verify Project

Run the verification required by `AGENTS.md`. Report the commands and results;
never claim checks passed when they were blocked or skipped.

## Steps

1. For Markdown-only changes, check formatting on the edited files and verify
   local links. An application build is unnecessary.

2. For application, configuration, or dependency changes, use Node 24.x from
   `.nvmrc` and run the full suite as one chained command:

   ```bash
   nvm use
   yarn lint && yarn prettier --check . && yarn typecheck && yarn build
   ```

3. If a check fails, show the relevant output, fix the cause, and rerun the
   applicable verification.

The suite runs ESLint, Prettier, strict TypeScript checks, and the static
export. There is no automated test suite.
