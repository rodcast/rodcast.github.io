# Rodrigo Castilho's Website

Personal website built with Next.js and TypeScript. It displays profile
information, public GitHub repositories, and Medium articles.

Live site: <https://rodrigocastilho.com/>

## Quick Start

Requires Node.js 24.x (`.nvmrc`) and Yarn.

```bash
nvm use
yarn install
yarn dev
```

Before opening a pull request for application changes, run:

```bash
yarn lint && yarn prettier --check . && yarn typecheck && yarn build
```

`yarn start` is unsupported with static export. Serve `out/` with a static file
server to inspect a production build. For Markdown-only changes, check
formatting and local links; no application build is needed.

## Behavior

- GitHub and Medium content is fetched at build time and included in the static
  export; it refreshes on a new build, not at request time.
- A failed GitHub request yields an empty project list. If Medium data is
  unavailable or empty, the build uses [`public/feed.xml`](public/feed.xml).
- Images are static assets and are not optimized by a server at runtime.
- The theme defaults to light and restores a saved preference.

## Environment

`.env.local` is optional. Set `NEXT_PUBLIC_GA_TRACKING_ID` to enable Google
Analytics and the cookie-consent banner. When unset, neither is rendered. CI
reads the value from a GitHub Actions variable.

When enabled, Analytics loads with consent denied by default. Accepting grants
analytics storage only; advertising consent remains denied.

## Deployment

Pushes to `master` or a manual dispatch run
[`.github/workflows/nextjs.yml`](.github/workflows/nextjs.yml), which checks,
builds, and deploys `out/` to GitHub Pages. The custom domain is configured in
[`public/CNAME`](public/CNAME).

Never commit directly to `master`. Follow [`AGENTS.md`](AGENTS.md#git-workflow)
for the Git workflow.

## API and Discovery

- API overview: [`public/docs/api.md`](public/docs/api.md); contract:
  [`public/docs/api/openapi.json`](public/docs/api/openapi.json)
- Authentication status: [`public/auth.md`](public/auth.md); OAuth/OIDC is not
  implemented.
- Discovery metadata: [`public/.well-known/`](public/.well-known/)
- GitHub Pages ignores custom headers and rewrites. Fetch `/index.md` directly
  instead of relying on `Accept: text/markdown` negotiation.

## Documentation

- [`AGENTS.md`](AGENTS.md): project guide (structure, commands, conventions,
  verification, and constraints)
- [`DESIGN.md`](DESIGN.md): architecture decisions and rationale
- [`CLAUDE.md`](CLAUDE.md): Claude-specific setup
- [`SECURITY.md`](SECURITY.md): vulnerability reporting
