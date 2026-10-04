# AGENTS.md

Project guide for human contributors and AI agents. Read it fully before making changes.

## Overview

Personal website for Rodrigo Castilho: profile content plus the owner's latest public GitHub repositories and Medium articles.

- **Stack:** Next.js 16 (Pages Router), React 19, TypeScript (strict), `@next/third-parties` (Google Analytics).
- **Deployment:** static export (`next build` → `out/`) hosted on GitHub Pages.
- **External data:** GitHub REST API (repos) and `rss2json` (Medium RSS), fetched at build time.
- **Tooling:** ESLint 9, Prettier, Husky (pre-commit), DeepSource (`.deepsource.toml`).
- **Runtime:** Node 24.x (`.nvmrc`), Yarn.

Architecture decisions live in [`DESIGN.md`](DESIGN.md).

## Project Structure

```text
src/
  pages/         # _app.tsx, _document.tsx, index.tsx (Pages Router)
  components/    # UI components
  fonts/         # Fontello icon font (next/font/local)
  shared/
    constants/   # External API URLs (paths.ts)
    interfaces/  # TypeScript contracts for API and UI data
    types/       # Ambient declarations (css.d.ts, webmcp.d.ts)
    utils/       # fetch helper, normalizers, WebMCP tool definitions
  styles/        # CSS Modules + globals.css
public/          # Served at the site root
  .well-known/   # API/OAuth/MCP/agent discovery metadata
  agent/, oauth/, api/health   # Static endpoint payloads
  docs/          # api.md and api/ (HTML docs + openapi.json)
  index.md, auth.md, llms.txt, feed.xml, sitemap.xml, robots.txt, manifest.json
  _headers       # Header rules (non-Pages hosts only, see Hosting)
  CNAME          # Custom domain
```

Key files:

| File                                  | Role                                                          |
| ------------------------------------- | ------------------------------------------------------------- |
| `src/pages/_app.tsx`                  | Global styles, cookie consent, Google Analytics, WebMCP setup |
| `src/pages/_document.tsx`             | SEO, Open Graph/Twitter tags, JSON-LD, discovery `<link>`s    |
| `src/pages/index.tsx`                 | Main page; fetches data in `getStaticProps`                   |
| `src/shared/utils/fetch.ts`           | Typed fetch helper (timeout, explicit errors)                 |
| `src/shared/utils/normalizeGitHub.ts` | Normalizes and filters GitHub responses                       |
| `src/shared/utils/normalizeMedium.ts` | Normalizes and filters Medium RSS responses                   |
| `src/shared/utils/webmcpTools.ts`     | WebMCP tool definitions (read from the rendered DOM)          |
| `next.config.mjs`                     | Static export config (see Critical Constraints)               |

## Commands

Run `nvm use` first so the Node version matches `.nvmrc`.

| Command                   | Purpose                                                        |
| ------------------------- | -------------------------------------------------------------- |
| `yarn install`            | Install dependencies                                           |
| `yarn dev`                | Dev server (sets `NODE_TLS_REJECT_UNAUTHORIZED=0`, local only) |
| `yarn build`              | Static production build to `out/`                              |
| `yarn lint` / `lint:fix`  | ESLint / ESLint with auto-fix                                  |
| `yarn prettier --check .` | Formatting check                                               |
| `yarn typecheck`          | `tsc --noEmit` (strict)                                        |

`yarn start` is unsupported with static export; serve `out/` with a static file server instead.

## Conventions

### Formatting

2-space indent, UTF-8, trailing newline. Prettier (`.prettierrc`): single quotes, semicolons, width 80, `trailingComma: es5`, parenthesized arrow params.

### Imports

Use `tsconfig.json` path aliases for anything outside the current directory; never `../` traversal.

| Alias            | Resolves to               |
| ---------------- | ------------------------- |
| `@/*`            | `src/*`                   |
| `@/components/*` | `src/components/*`        |
| `@/constants/*`  | `src/shared/constants/*`  |
| `@/interfaces/*` | `src/shared/interfaces/*` |
| `@/types/*`      | `src/shared/types/*`      |
| `@/utils/*`      | `src/shared/utils/*`      |

Same-directory siblings are imported relatively (`./SocialLinks`). `next/font/local` needs a real relative path (`../fonts/fontello.woff2` in `SocialLinks.tsx`).

### Styling

CSS Modules for all component styles. `src/styles/globals.css` is only for resets, CSS custom properties, and a few a11y utilities (e.g. `.sr-only`).

### Data Flow

```text
getStaticProps (build time)
  → Promise.allSettled([fetchData(GITHUB_API), fetchData(MEDIUM_API)])
      (5s timeout; a rejected source becomes [])
  → normalizeGitHub / normalizeMedium
  → page props → Article → GitHub + Medium
```

- Normalize all external API data before it reaches components.
- If an API contract changes, update the interface in `src/shared/interfaces/` and its normalizer together.
- Keep the error boundaries, API fallback components, and the fetch helper's timeout and explicit errors.

### Discovery Metadata

- Keep `.well-known` documents consistent: `api-catalog`, `agent-card.json`, `mcp.json`, `mcp/server-card.json`, `ai-plugin.json`, OAuth/OIDC metadata, and the agent-skills index.
- After editing any `public/.well-known/agent-skills/*.md`, refresh its `sha256` in `agent-skills/index.json` (`shasum -a 256 <file>`).
- Keep WebMCP tool names in `webmcpTools.ts` aligned with the skill IDs in `agent-card.json` and the list in `agent-skills/webmcp-tools.md`.
- Keep the discovery `<link>`s in `_document.tsx` consistent with the `Link` header in `public/_headers` and `vercel.json`.
- Use the `check-discovery-consistency` skill (`.claude/skills/`) to audit all of the above.

## Guidelines

**Do**

- Make focused, minimal changes scoped to the task; extend existing utilities and components instead of duplicating logic.
- Keep accessibility intact: semantic HTML, labels, readable fallback messages.
- Open external links with `target="_blank"` and `rel` containing `noopener` (preserve existing values).
- Keep SEO metadata and JSON-LD coherent when editing profile content.
- Work on a branch and open a PR (see Git Workflow).

**Do not**

- Add broad refactors or unrequested improvements.
- Add SSR-only or runtime server dependencies; the site must stay statically exportable.

For hard rules, see **Critical Constraints** (export settings) and **Git Workflow** (never push to `master`).

## Verification

Before considering a task done, run the full check, resolve all errors, and show the output:

```bash
nvm use
yarn lint && yarn prettier --check . && yarn typecheck && yarn build
```

The Husky pre-commit hook runs lint and the Prettier check; CI runs all four. There is no automated test suite, so these are the enforced quality baseline.

## Git Workflow

- **Never commit or push directly to `master`.** Branch and open a pull request for every change.
- `master` is the deployment branch: a push triggers the GitHub Pages build, so changes must land via reviewed PRs.
- Delegate mechanical Git tasks (branches, commits, pushes, PRs) to a low-cost model (e.g. Haiku); the rule above still applies to it.

## CI/CD and Hosting

- **Workflow:** `.github/workflows/nextjs.yml`, on push to `master` or manual dispatch. Node comes from `.nvmrc`.
- **Pipeline:** `yarn install --frozen-lockfile` → lint + Prettier check → typecheck → `actions/configure-pages` → `next build` → upload `out/` (with `include-hidden-files: true` so `.well-known/` ships) → `actions/deploy-pages`.
- `configure-pages` runs with `static_site_generator: next` and injects `basePath` into `next.config.mjs`. It runs after the Prettier check because that injection isn't Prettier-formatted.
- `NEXT_PUBLIC_GA_TRACKING_ID` is a public GA measurement ID, injected from an Actions **variable** (not a secret).
- GitHub Pages is the canonical host. `vercel.json` exists only for alternative hosts.

**Hosting caveat:** GitHub Pages serves static files only. It ignores `vercel.json` rewrites and the `public/_headers` rules (`Link`, `Vary`, `Cache-Control`, content negotiation); they take effect only on Vercel, Cloudflare Pages, or Netlify. On Pages, the agent/discovery surface is the static files under `public/` plus the `<link>` tags in `_document.tsx`. `Accept: text/markdown` negotiation is inactive, so fetch `/index.md` directly.

## Critical Constraints

Do not change these; doing so breaks the build or deployment.

```js
// next.config.mjs
const nextConfig = {
  output: 'export', // static HTML export
  trailingSlash: true, // correct GitHub Pages routing
  images: { unoptimized: true }, // no image optimization server
};
```

**Environment:** `NEXT_PUBLIC_GA_TRACKING_ID` is optional and read at build time. Set it in `.env.local` only to test analytics locally. When unset, `_app.tsx` renders neither `CookieConsent` nor `GoogleAnalytics`, and `_document.tsx` skips the Google Consent Mode defaults script.
