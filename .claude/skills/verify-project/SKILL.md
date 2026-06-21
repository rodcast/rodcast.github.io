---
name: verify-project
description: Run the project's full verification suite (lint, Prettier check, typecheck, static build) and report results. Use before opening a PR, after finishing a change, or whenever the user asks to verify, validate, or check that the project is shippable.
---

# Verify Project

Run the full quality gate defined in `AGENTS.md` → **Verification** and resolve every error before declaring success. Show the command output as evidence — never assert success without it.

## Steps

1. **Activate the correct Node version.** The project requires Node 24.x (see `.nvmrc`). The pre-commit hook fails on the wrong version, so always start here:

   ```bash
   nvm use
   ```

2. **Run the full suite.** Each step must pass with no errors:

   ```bash
   yarn lint && yarn prettier --check . && yarn typecheck && yarn build
   ```

   | Command                   | Checks                                                        |
   | ------------------------- | ------------------------------------------------------------- |
   | `yarn lint`               | ESLint (also enforced by the Husky pre-commit hook)           |
   | `yarn prettier --check .` | Prettier formatting (pre-commit hook + CI)                    |
   | `yarn typecheck`          | `tsc --noEmit`, strict mode — must report zero errors         |
   | `yarn build`              | Static export to `out/` — a build failure means not shippable |

3. **Report honestly.** If any step fails, show the failing output, fix the cause, and re-run the whole suite. Do not skip a step or call the task done on a partial pass.

## Notes

- Run the steps as a single chained command so a failure short-circuits the rest.
- This project has no automated test suite; this suite is the enforced baseline quality check.
