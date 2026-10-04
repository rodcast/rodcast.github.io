---
name: verify-project
description: Run the project's full verification suite (lint, Prettier check, typecheck, static build) and report results. Use before opening a PR, after finishing a change, or whenever the user asks to verify, validate, or check that the project is shippable.
---

# Verify Project

Run the quality gate from `AGENTS.md` → **Verification** and fix every error before declaring success. Show the command output as evidence.

## Steps

1. Match the Node version (24.x, from `.nvmrc`):

   ```bash
   nvm use
   ```

2. Run the suite as one chained command so a failure short-circuits the rest:

   ```bash
   yarn lint && yarn prettier --check . && yarn typecheck && yarn build
   ```

   | Command                   | Checks                                           |
   | ------------------------- | ------------------------------------------------ |
   | `yarn lint`               | ESLint (Husky pre-commit + CI)                   |
   | `yarn prettier --check .` | Formatting (Husky pre-commit + CI)               |
   | `yarn typecheck`          | `tsc --noEmit`, strict, zero errors (CI)         |
   | `yarn build`              | Static export to `out/`; failure = not shippable |

3. If a step fails, show the output, fix the cause, and re-run the whole suite. Never skip a step or report success on a partial pass.

There is no automated test suite; this gate is the enforced baseline.
