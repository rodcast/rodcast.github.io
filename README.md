# Rodrigo Castilho

Personal website built with Next.js (Pages Router) and TypeScript. It renders profile content plus the latest public GitHub repositories and Medium articles, fetched at build time and deployed as a static export on GitHub Pages.

Live site: <https://rodrigocastilho.com/>

## Quick Start

Requires Node.js 24.x (`.nvmrc`) and Yarn.

```bash
nvm use
yarn install
yarn dev
```

Before opening a PR, run the full verification suite:

```bash
yarn lint && yarn prettier --check . && yarn typecheck && yarn build
```

`yarn start` is not supported with static export; serve `out/` with a static file server to check the build.

## Environment

`.env.local` is optional. `NEXT_PUBLIC_GA_TRACKING_ID` (Google Analytics measurement ID, read at build time) enables analytics and the cookie consent banner; when unset, neither renders. CI reads it from an Actions variable of the same name.

## Deployment

Pushes to `master` (or a manual dispatch) run `.github/workflows/nextjs.yml`: lint, Prettier check, typecheck, static build, then deploy `out/` to GitHub Pages. Custom domain: `public/CNAME`.

Never commit to `master`; branch and open a pull request.

## API and Discovery

- API overview: `public/docs/api.md`; OpenAPI contract: `public/docs/api/openapi.json`
- Agent registration contract: `public/auth.md`
- Discovery metadata: `public/.well-known/`
- GitHub Pages ignores the `Link`/`Vary` rules in `public/_headers` and the `vercel.json` rewrites. Fetch `/index.md` directly instead of using `Accept: text/markdown`.

## Documentation

- [`AGENTS.md`](AGENTS.md): project guide (structure, commands, conventions, CI/CD, constraints)
- [`DESIGN.md`](DESIGN.md): architecture decisions and rationale
- [`CLAUDE.md`](CLAUDE.md): Claude-specific setup
- [`SECURITY.md`](SECURITY.md): vulnerability reporting
