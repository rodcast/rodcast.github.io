# Rodrigo Castilho

Personal website built with Next.js (Pages Router) and TypeScript.
It renders profile content and fetches the latest public GitHub repositories and Medium articles at build time.

Live site: <https://rodrigocastilho.com/>

## Tech Stack

- Next.js 16
- React 19
- TypeScript (strict)
- ESLint + Prettier + Husky
- GitHub Pages (static export)

## Requirements

- Node.js 24.x (see `.nvmrc`)
- Yarn

## Setup

```bash
nvm use
yarn install
yarn dev
```

## Scripts

- `yarn dev`: Start the development server (sets `NODE_TLS_REJECT_UNAUTHORIZED=0`).
- `yarn build`: Build the statically exported site.
- `yarn start`: Run the production Next.js server locally.
- `yarn lint`: Run ESLint checks.
- `yarn lint:fix`: Run ESLint and auto-fix issues.
- `yarn typecheck`: Type-check the project with `tsc --noEmit` (strict mode).

## Environment

Copy `.env.example` to `.env.local` and fill in what you need.

- `NEXT_PUBLIC_GA_TRACKING_ID` (optional): Google Analytics measurement ID, read at build time. When it is unset, neither the cookie consent banner nor Google Analytics is rendered. In CI it comes from a GitHub Actions variable of the same name.

## Development Workflow

1. Run `nvm use`.
2. Install dependencies with `yarn install`.
3. Start local development with `yarn dev`.
4. Before opening a PR, run the full verification suite: `yarn lint && yarn prettier --check . && yarn typecheck && yarn build`.

## Build and Deployment

- Static export via Next.js (`output: 'export'`).
- The canonical deployment artifact is the static `out/` directory.
- Deployment runs through GitHub Actions workflow `.github/workflows/nextjs.yml`, which runs lint, the Prettier check, and typecheck before building.
- Production deploys are triggered by pushes to `master` (and manual workflow dispatch).
- When validating the exported site locally, serve `out/` with a static file server.
- Custom domain: `public/CNAME` (`rodrigocastilho.com`).

## Project Conventions

- Keep these static export constraints in `next.config.mjs`: `output: 'export'`, `trailingSlash: true`, and `images.unoptimized: true`.
- Data is fetched at build time from GitHub and Medium.
- Normalize external API responses before passing data to components (`src/shared/utils/normalizeGitHub.ts` and `src/shared/utils/normalizeMedium.ts`).
- Use TypeScript path aliases from `tsconfig.json` (for example `@/components/*`, `@/utils/*`) for cross-directory imports; same-directory siblings are imported relatively.
- Component styles use CSS Modules in `src/styles/`; only resets, CSS custom properties, and a few accessibility utilities live in `globals.css`.
- Branch and open a pull request for every change — never commit to `master` (see `AGENTS.md` → Git Workflow).

## API and Discovery

- API overview: `public/docs/api.md`
- OpenAPI contract: `public/docs/api/openapi.json`
- Agent registration contract: `public/auth.md`
- Static discovery metadata lives under `public/.well-known/`, including the API catalog, MCP metadata, OAuth/OIDC metadata, agent card, and agent skills index.
- GitHub Pages serves static files only, so the `Link`/`Vary` header rules in `public/_headers` and the `vercel.json` rewrites are inactive in production. Fetch `/index.md` directly instead of relying on `Accept: text/markdown`.

## Further Documentation

- `AGENTS.md` — full project guide: structure, commands, conventions, verification, Git workflow.
- `DESIGN.md` — architecture decisions and rationale.
- `CLAUDE.md` — Claude-specific quick reference.
- `SECURITY.md` — vulnerability reporting policy.
