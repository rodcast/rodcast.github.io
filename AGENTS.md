# AGENTS.md

This file describes the project for both human contributors and AI agents. Read it fully before making changes.

---

## Project Overview

Personal website for Rodrigo Castilho.

- **Stack:** Next.js (Pages Router) + React + TypeScript.
- **Purpose:** Display profile content alongside the owner's latest public GitHub repositories and Medium articles.
- **Deployment:** Statically exported (`next build` → `out/`) and hosted on GitHub Pages.

---

## Project Structure

```text
src/
  pages/         # Next.js pages (Pages Router)
  components/    # UI components
  fonts/         # Local Fontello icon font (loaded via next/font/local)
  shared/
    constants/   # External API endpoint URLs
    interfaces/  # TypeScript contracts for API and UI data
    types/       # Ambient type declarations
    utils/       # Fetch helper, data normalizers, WebMCP tool definitions
  styles/        # CSS Modules + global CSS
public/          # Static assets served at the root
  .well-known/   # API/OAuth/MCP/Agent discovery metadata
  agent/         # Static agent endpoint payloads
  oauth/         # Static OAuth endpoint payloads
  docs/api/      # Static API docs (HTML) and OpenAPI contract
  docs/api.md    # Markdown API docs for agents
  api/health     # Static health endpoint payload
  index.md       # Markdown representation of the homepage
  auth.md        # Agent registration / auth flow contract
  llms.txt       # Agent-oriented site index
  feed.xml       # RSS feed
  sitemap.xml    # Sitemap
  robots.txt     # Crawler directives
  manifest.json  # PWA manifest
  _headers       # Header rules (non-Pages hosts only — see below)
  CNAME          # Custom domain for GitHub Pages
```

### Key Files

| File                                  | Role                                                           |
| ------------------------------------- | -------------------------------------------------------------- |
| `src/pages/_app.tsx`                  | Global styles, cookie consent, Google Analytics, WebMCP setup  |
| `src/pages/_document.tsx`             | SEO metadata, Open Graph/Twitter tags, JSON-LD, PWA links      |
| `src/pages/index.tsx`                 | Main page — fetches data at build time via `getStaticProps`    |
| `src/shared/types/webmcp.d.ts`        | Ambient WebMCP navigator and tool type declarations            |
| `src/shared/constants/paths.ts`       | External API endpoint constants                                |
| `src/shared/utils/fetch.ts`           | Typed fetch helper with timeout and error handling             |
| `src/shared/utils/normalizeGitHub.ts` | Normalizes and filters GitHub API responses                    |
| `src/shared/utils/normalizeMedium.ts` | Normalizes and filters Medium RSS feed responses               |
| `src/shared/utils/webmcpTools.ts`     | WebMCP tool definitions read from the rendered DOM             |
| `public/.well-known/api-catalog`      | API catalog for client and agent service discovery             |
| `public/.well-known/agent-skills/`    | Agent Skills index and capability docs                         |
| `public/docs/api/openapi.json`        | Public OpenAPI contract for static metadata endpoints          |
| `next.config.mjs`                     | Next.js config — must preserve static export settings          |
| `CLAUDE.md`                           | Quick reference for Claude AI (commands, aliases, constraints) |
| `DESIGN.md`                           | Architecture decisions and rationale                           |
| `SECURITY.md`                         | Vulnerability reporting policy (mirrors `security.txt`)        |

---

## Tech Stack

### Runtime Dependencies

| Package                    | Purpose                      |
| -------------------------- | ---------------------------- |
| `next@16`                  | Framework                    |
| `react@19`, `react-dom@19` | UI library                   |
| `@next/third-parties`      | Google Analytics integration |

### External APIs

| API                     | Used For                                    |
| ----------------------- | ------------------------------------------- |
| GitHub REST API         | Fetching the owner's public repositories    |
| `rss2json` (Medium RSS) | Fetching the owner's latest Medium articles |

### Tooling

| Tool                | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| TypeScript (strict) | Type safety (`tsconfig.json`)                             |
| ESLint 9            | Linting (Next.js + React + TypeScript rules)              |
| Prettier            | Code formatting                                           |
| Husky               | Pre-commit hook that runs lint + Prettier check           |
| DeepSource          | Static analysis (`.deepsource.toml`, JavaScript analyzer) |

---

## Common Commands

| Command          | Purpose                                   |
| ---------------- | ----------------------------------------- |
| `nvm use`        | Load Node version defined in `.nvmrc`     |
| `yarn install`   | Install dependencies                      |
| `yarn dev`       | Start local development server            |
| `yarn build`     | Generate static production build (`out/`) |
| `yarn start`     | Run the production Next.js server locally |
| `yarn lint`      | Run ESLint                                |
| `yarn lint:fix`  | Run ESLint and auto-fix issues            |
| `yarn typecheck` | Type-check with `tsc --noEmit` (strict)   |

> Run `nvm use` before Yarn commands to ensure the exact Node version from `.nvmrc` is active.
> **Node version:** 24.x (see `.nvmrc`). **Package manager:** Yarn.

---

## CI/CD and Deployment

- **Workflow file:** `.github/workflows/nextjs.yml`
- **Trigger:** Push to `master` branch, or manual dispatch.
- **Node version:** taken from `.nvmrc` (`node-version-file`), so CI and local stay in sync.
- **Pipeline:** install (`yarn install --frozen-lockfile`) → `yarn lint` + `prettier --check .` → `yarn typecheck` → `actions/configure-pages` → `next build` → upload `out/` → deploy.
- **Build output:** Static files in `out/` (uploaded with `include-hidden-files: true` so `.well-known/` ships).
- **Deploy target:** GitHub Pages via `actions/deploy-pages`.
- `actions/configure-pages` runs with `static_site_generator: next`, which injects `basePath` into `next.config.mjs` at build time. It runs **after** the Prettier check because that injection is not Prettier-formatted.
- `NEXT_PUBLIC_GA_TRACKING_ID` is injected into the build step from an Actions **variable** (Settings → Secrets and variables → Actions → Variables). It is a public GA measurement ID, not a secret.
- A `vercel.json` file exists but the canonical production deployment is GitHub Pages.

> **Hosting caveat:** GitHub Pages serves static files only — it does **not**
> apply `vercel.json` rewrites or the `public/_headers` rules (`Link`, `Vary`,
> `Cache-Control`, content negotiation). Those files only take effect on a host
> that honors them (Vercel, Cloudflare Pages, Netlify). On GitHub Pages the
> agent/discovery surface is the static files under `public/` plus the `<link>`
> tags in `src/pages/_document.tsx`; `Accept: text/markdown` negotiation is not
> active, so fetch `/index.md` directly.
>
> The canonical deployment artifact is the generated `out/` directory.

---

## Development Conventions

### Formatting

- 2-space indentation, UTF-8 encoding, trailing newline.
- Prettier config (`.prettierrc`): single quotes, semicolons, print width 80, `trailingComma: es5`, always-parenthesized arrow params.

### Imports

- Use TypeScript path aliases (`@/*`, `@/components/*`, `@/utils/*`, etc.) for modules outside the current directory — never `../` traversal.
- Sibling files within the same directory are imported relatively, matching the existing code (e.g. `./SocialLinks` inside `src/components/`, `./fetch` inside `src/shared/utils/`).
- Exception: `next/font/local` requires a real relative asset path, so `SocialLinks.tsx` loads the icon font as `../fonts/fontello.woff2`.

### Data Flow

- All external API data must be normalized through the appropriate utility before being passed to components.
- `getStaticProps` fetches both sources with `Promise.allSettled` so one failing API cannot blank the other; a rejected source becomes an empty array.
- If an API contract changes, update both the interface in `src/shared/interfaces/` and its corresponding normalizer together.

### Discovery Metadata

- Keep `.well-known` discovery documents internally consistent (`api-catalog`, `agent-card.json`, `mcp.json`, `mcp/server-card.json`, `ai-plugin.json`, OAuth/OIDC metadata, and agent-skills index).
- When updating any `public/.well-known/agent-skills/*.md` file, refresh the matching `sha256` entry in `public/.well-known/agent-skills/index.json` (`shasum -a 256 <file>`).
- Keep the WebMCP tool names in `src/shared/utils/webmcpTools.ts` in sync with the skill IDs in `agent-card.json` and the tool list in `agent-skills/webmcp-tools.md`.
- Preserve API discovery links exposed in `src/pages/_document.tsx` (the discovery surface honored on GitHub Pages) and keep them consistent with the `Link` header in `public/_headers`/`vercel.json` (used only on non-Pages hosts).
- The `check-discovery-consistency` skill (`.claude/skills/`) audits all of the above.

### Error Handling

- Preserve the existing resilience patterns: error boundaries and API fallback components.
- The fetch helper must retain its timeout and explicit error messaging.

---

## Guidelines for Contributors and AI Agents

Follow these rules when making any change to this codebase.

### Do

- Make focused, minimal changes scoped to the task.
- Extend existing shared utilities and components rather than duplicating logic.
- Keep accessibility intact: use semantic HTML, labels, and readable fallback messages.
- Keep SEO metadata and JSON-LD structured data coherent when editing profile content.
- Verify every change before completing a task (see Verification below).
- Always work on a separate branch and open a pull request for review (see Git Workflow below).

### Do Not

- Introduce broad refactors or unsolicited "improvements" beyond the task scope.
- Add SSR-only or runtime server dependencies — the site must remain statically exportable.
- Break the `next.config.mjs` static export settings (see Critical Constraints below).
- Commit or push directly to `master`.

### Verification

Before considering any task done, run the full check and resolve all errors — don't rely on "looks done":

```bash
nvm use                                  # required: project uses Node 24.x (see .nvmrc)
yarn lint && yarn prettier --check . && yarn typecheck && yarn build
```

- `yarn lint` — ESLint (also enforced by the Husky pre-commit hook).
- `yarn prettier --check .` — Prettier formatting check (also enforced by the Husky pre-commit hook and CI).
- `yarn typecheck` — `tsc --noEmit`; must pass with no errors (strict mode).
- `yarn build` — must produce a successful static export to `out/`; a build failure means the change is not shippable.

Show the command output as evidence rather than asserting success.

### Git Workflow

- **Never commit or push directly to `master`.**
- Always create a separate branch for your changes and open a pull request.
- `master` is the deployment branch — a push to it triggers the GitHub Pages build (`.github/workflows/nextjs.yml`). All changes must land via reviewed PRs.
- Delegate simple, mechanical Git tasks — creating branches, commits, pushes, and pull requests — to a low-cost agent/model (e.g. Haiku) to save cost. These steps don't require deep reasoning, but the rule above still holds: the low-cost agent must branch + open a PR and **never** commit or push directly to `master`.

---

## Critical Constraints

These settings must not be changed. Violating them will break the production build or deployment.

### `next.config.mjs` — required options

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static HTML export
  trailingSlash: true, // Required for correct GitHub Pages routing
  images: {
    unoptimized: true, // Required for static export (no image optimization server)
  },
};
```

### Quality Gate

- The pre-commit hook (`.husky/pre-commit`) runs `yarn lint && yarn prettier --check .` and fails the commit on any error.
- CI additionally runs `yarn typecheck` and the static build.
- There is no automated test suite; lint, formatting, typecheck, and a clean static export are the enforced baseline quality checks.

### Environment Variables

- `NEXT_PUBLIC_GA_TRACKING_ID` — Google Analytics measurement ID, read at build time (see `.env.example` for the local template).
  - Optional. When it is unset, `_app.tsx` renders neither the `CookieConsent` banner nor `GoogleAnalytics`, and `_document.tsx` skips the Google Consent Mode defaults script.
  - In CI it comes from the `NEXT_PUBLIC_GA_TRACKING_ID` Actions variable.
