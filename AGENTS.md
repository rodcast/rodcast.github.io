# Project Guide

Applies to human contributors and AI agents. Read before making changes.

## Project

Personal website for Rodrigo Castilho. The homepage combines profile content
with public GitHub repositories and Medium articles.

- **Stack:** Next.js 16 Pages Router, React 19, strict TypeScript.
- **Hosting:** static export to `out/`, deployed to GitHub Pages.
- **Data:** GitHub REST API and `rss2json` are queried at build time; Medium
  falls back to `public/feed.xml`.
- **Tools:** Node 24 (`.nvmrc`), Yarn, ESLint, Prettier, and Husky.

See [`DESIGN.md`](DESIGN.md) for architecture and data-flow details.

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
  .well-known/   # API/MCP/agent discovery metadata (no OAuth/OIDC endpoints)
  api/           # Static health and health.json responses
  docs/          # api.md and api/ (HTML docs + openapi.json)
  index.md, auth.md, llms.txt, feed.xml, sitemap.xml, robots.txt, manifest.json
  _headers       # Header rules (non-Pages hosts only, see Hosting)
  CNAME          # Custom domain
```

Key files:

| File                                  | Role                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `src/pages/_app.tsx`                  | Global styles, cookie consent, Google Analytics, WebMCP setup            |
| `src/pages/_document.tsx`             | SEO, Open Graph/Twitter tags, JSON-LD, discovery `<link>`s               |
| `src/pages/index.tsx`                 | Main page; fetches data in `getStaticProps`                              |
| `src/shared/utils/fetch.ts`           | JSON fetch helper (timeout, explicit errors; normalizers shape the data) |
| `src/shared/utils/normalizeGitHub.ts` | Normalizes and filters GitHub responses                                  |
| `src/shared/utils/normalizeMedium.ts` | Normalizes Medium API responses and the bundled RSS fallback             |
| `src/shared/utils/webmcpTools.ts`     | WebMCP tool definitions (read from the rendered DOM)                     |
| `next.config.mjs`                     | Static export config (see Critical Constraints)                          |

## Setup and Commands

Use the Node version in `.nvmrc`, then install dependencies:

```bash
nvm use
yarn install
yarn dev
```

- `yarn lint` — run ESLint.
- `yarn prettier --check .` — check formatting.
- `yarn typecheck` — run strict TypeScript checks.
- `yarn build` — export the production site to `out/`.

`yarn start` is unsupported with static export. To inspect a production build,
serve `out/` with a static file server.

## Code and Content

Follow the existing Prettier configuration; do not restate formatting rules
enforced by tooling.

### Imports

Use `tsconfig.json` path aliases across directories; do not use parent-directory
traversal.

| Alias            | Resolves to               |
| ---------------- | ------------------------- |
| `@/*`            | `src/*`                   |
| `@/components/*` | `src/components/*`        |
| `@/constants/*`  | `src/shared/constants/*`  |
| `@/interfaces/*` | `src/shared/interfaces/*` |
| `@/types/*`      | `src/shared/types/*`      |
| `@/utils/*`      | `src/shared/utils/*`      |

Import same-directory siblings relatively. `next/font/local` requires a real
relative path; see `src/shared/font.ts`.

### Styling

Use CSS Modules for component styles. Reserve `src/styles/globals.css` for
resets, CSS variables, and shared accessibility utilities.

- Preserve visible keyboard focus, the skip link, and readable text contrast in
  both themes.
- The global `prefers-reduced-motion: reduce` rule minimizes CSS animation and
  transition durations. Explicit JavaScript animation or smooth scrolling must
  respect that preference separately.
- Theme state is stored under `data-theme` in local storage. The pre-paint
  script in `_document.tsx` restores it, defaulting to light; `Toggle`
  synchronizes after hydration.

### Static Images

- `images.unoptimized: true` is required for `next/image` on GitHub Pages.
- Optimize image assets before deployment; the static export does not resize or
  compress them.

### Data Flow

- Normalize all external API data before it reaches components.
- If an API contract changes, update its interface in
  `src/shared/interfaces/` and its normalizer together.
- Preserve the fetch helper's timeout and explicit errors, the Medium RSS
  fallback, and the existing empty/error states. Error boundaries do not catch
  build-time fetching failures.

### Discovery Metadata

- Keep `.well-known` documents consistent: `api-catalog`, `agent-card.json`,
  `mcp.json`, `mcp/server-card.json`, `ai-plugin.json`, and the agent-skills
  index. Do not publish OAuth/OIDC metadata until working authentication
  endpoints exist.
- After editing `public/.well-known/agent-skills/*.md`, update its `sha256` in
  `agent-skills/index.json` (`shasum -a 256 <file>`).
- Keep WebMCP tool names in `webmcpTools.ts` aligned with the skill IDs in
  `agent-card.json` and `agent-skills/webmcp-tools.md`.
- Keep discovery links in `_document.tsx` consistent with `Link` in
  `public/_headers` and `vercel.json`.
- After discovery changes, run the `check-discovery-consistency` skill.

## General Rules

- Keep changes focused and reuse existing utilities and patterns.
- Preserve accessibility: semantic HTML, visible focus, labels, and readable
  fallback messages.
- External links opened in a new tab must include `rel="noopener"`.
- Keep SEO metadata and JSON-LD aligned with profile content.
- Keep the site statically exportable; avoid server-only features and
  dependencies.
- Avoid broad refactors and unrelated improvements.

## Verification

For application, configuration, or dependency changes, run the full check:

```bash
nvm use
yarn lint && yarn prettier --check . && yarn typecheck && yarn build
```

For Markdown-only changes, check formatting and local documentation links; no application build is required. If a hook blocks verification, report the command and denial explicitly rather than claiming the checks passed.

There is no automated test suite; CI runs lint, Prettier, typecheck, and build.

## Git Workflow

- Never commit or push directly to `master`; it triggers deployment. Changes
  should land through a reviewed pull request.
- Create a branch, commit, push, or open a pull request only when the user asks.
- Preserve existing user changes. Do not bypass or weaken repository hooks; if
  one blocks an operation, report the denial.
- See [`.claude/rules/git-workflow.md`](.claude/rules/git-workflow.md) for
  details.

## Hosting

GitHub Pages serves static files and ignores `vercel.json` rewrites and
`public/_headers`. Its discovery surface is the public static files and
`_document.tsx` links. Fetch `/index.md` directly; `Accept: text/markdown`
negotiation only works on hosts that honor custom rewrites and headers.

## Critical Constraints

Keep these export settings; changing them breaks the build or deployment.

```js
// next.config.mjs
const nextConfig = {
  output: 'export', // static HTML export
  trailingSlash: true, // correct GitHub Pages routing
  images: { unoptimized: true }, // no image optimization server
};
```

`NEXT_PUBLIC_GA_TRACKING_ID` is optional and read at build time. When unset,
analytics, the consent banner, and the consent-defaults script are omitted.
