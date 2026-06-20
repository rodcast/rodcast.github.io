# Rodrigo Castilho (RODCAST)

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

- `yarn dev`: Start the development server.
- `yarn build`: Build the statically exported site.
- `yarn start`: Serve the production build locally.
- `yarn lint`: Run ESLint checks.
- `yarn lint:fix`: Run ESLint and auto-fix issues.

## Environment

- `NEXT_PUBLIC_GA_TRACKING_ID` (optional): Enables Google Analytics when set at build time.

## Development Workflow

1. Run `nvm use`.
2. Install dependencies with `yarn install`.
3. Start local development with `yarn dev`.
4. Run `yarn lint` before opening a PR.
5. Validate production output with `yarn build`.

## Build and Deployment

- Static export via Next.js (`output: 'export'`).
- Build artifacts are generated in `out/`.
- Deployment runs through GitHub Actions workflow `.github/workflows/nextjs.yml`.
- Production deploys are triggered by pushes to `master` (and manual workflow dispatch).

## Project Conventions

- Keep these static export constraints in `next.config.mjs`: `output: 'export'`, `trailingSlash: true`, and `images.unoptimized: true`.
- Data is fetched at build time from GitHub and Medium.
- Normalize external API responses before passing data to components (`src/shared/utils/normalizeGitHub.ts` and `src/shared/utils/normalizeMedium.ts`).
- Use TypeScript path aliases from `tsconfig.json` (for example `@/components/*`, `@/utils/*`) instead of relative imports.

## API and Discovery

- API overview: `public/docs/api.md`
- OpenAPI contract: `public/docs/api/openapi.json`
- Agent skills index: `public/.well-known/agent-skills/index.json`
