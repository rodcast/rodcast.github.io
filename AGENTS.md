# AGENTS.md

This file describes the project for both human contributors and AI agents. Read it fully before making changes.

---

## Project Overview

Personal website for Rodrigo Castilho (RODCAST).

- **Stack:** Next.js (Pages Router) + React + TypeScript.
- **Purpose:** Display profile content alongside the owner's latest public GitHub repositories and Medium articles.
- **Deployment:** Statically exported (`next build` → `out/`) and hosted on GitHub Pages.

---

## Project Structure

```text
src/
  pages/         # Next.js pages (Pages Router)
  components/    # UI components
  shared/
    constants/   # External API endpoint URLs
    interfaces/  # TypeScript contracts for API and UI data
    types/       # Ambient type declarations
    utils/       # Fetch helper, data normalizers
  styles/        # CSS Modules + global CSS
public/          # Static assets served at the root
  .well-known/   # API/OAuth/MCP/Agent discovery metadata
  docs/api/      # Static API docs and OpenAPI contract
  api/health     # Static health endpoint payload
```

### Key Files

| File                                  | Role                                                        |
| ------------------------------------- | ----------------------------------------------------------- |
| `src/pages/_app.tsx`                  | Global styles, Google Analytics, Vercel Speed Insights      |
| `src/pages/_document.tsx`             | SEO metadata, Open Graph/Twitter tags, JSON-LD, PWA links   |
| `src/pages/index.tsx`                 | Main page — fetches data at build time via `getStaticProps` |
| `src/shared/types/webmcp.d.ts`        | Ambient WebMCP navigator and tool type declarations         |
| `src/shared/constants/paths.ts`       | External API endpoint constants                             |
| `src/shared/utils/fetch.ts`           | Typed fetch helper with timeout and error handling          |
| `src/shared/utils/normalizeGitHub.ts` | Normalizes and filters GitHub API responses                 |
| `src/shared/utils/normalizeMedium.ts` | Normalizes and filters Medium RSS feed responses            |
| `public/.well-known/api-catalog`      | API catalog for client and agent service discovery          |
| `public/.well-known/agent-skills/`    | Agent Skills index and capability docs                      |
| `public/docs/api/openapi.json`        | Public OpenAPI contract for static metadata endpoints       |
| `next.config.mjs`                     | Next.js config — must preserve static export settings       |

---

## Tech Stack

### Runtime Dependencies

| Package                    | Purpose                      |
| -------------------------- | ---------------------------- |
| `next@16`                  | Framework                    |
| `react@19`, `react-dom@19` | UI library                   |
| `@next/third-parties`      | Google Analytics integration |
| `@vercel/speed-insights`   | Performance monitoring       |

### External APIs

| API                     | Used For                                    |
| ----------------------- | ------------------------------------------- |
| GitHub REST API         | Fetching the owner's public repositories    |
| `rss2json` (Medium RSS) | Fetching the owner's latest Medium articles |

### Tooling

| Tool                | Purpose                                      |
| ------------------- | -------------------------------------------- |
| TypeScript (strict) | Type safety (`tsconfig.json`)                |
| ESLint 9            | Linting (Next.js + React + TypeScript rules) |
| Prettier            | Code formatting                              |
| Husky               | Pre-commit hook that runs lint               |

---

## Common Commands

| Command         | Purpose                                   |
| --------------- | ----------------------------------------- |
| `yarn install`  | Install dependencies                      |
| `yarn dev`      | Start local development server            |
| `yarn build`    | Generate static production build (`out/`) |
| `yarn start`    | Serve the production build locally        |
| `yarn lint`     | Run ESLint                                |
| `yarn lint:fix` | Run ESLint and auto-fix issues            |

> **Node version:** 22.x (see `.nvmrc`). **Package manager:** Yarn.

---

## CI/CD and Deployment

- **Workflow file:** `.github/workflows/nextjs.yml`
- **Trigger:** Push to `master` branch, or manual dispatch.
- **Build output:** Static files in `out/`.
- **Deploy target:** GitHub Pages via `actions/deploy-pages`.
- A `vercel.json` file exists but the canonical production deployment is GitHub Pages.

---

## Development Conventions

### Formatting

- 2-space indentation, UTF-8 encoding, trailing newline.
- Prettier config: single quotes, semicolons, print width 80.

### Imports

- Use TypeScript path aliases (`@/*`, `@/components/*`, `@/utils/*`, etc.) instead of relative paths.

### Data Flow

- All external API data must be normalized through the appropriate utility before being passed to components.
- If an API contract changes, update both the interface in `src/shared/interfaces/` and its corresponding normalizer together.

### Discovery Metadata

- Keep `.well-known` discovery documents internally consistent (`api-catalog`, OAuth/OIDC metadata, MCP server card, and agent-skills index).
- When updating any `public/.well-known/agent-skills/*.md` file, refresh the matching `sha256` entry in `public/.well-known/agent-skills/index.json`.
- Preserve API discovery links exposed in both `src/pages/_document.tsx` and `public/_headers`.

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
- Run `yarn lint` and resolve all errors before completing a task.

### Do Not

- Introduce broad refactors or unsolicited "improvements" beyond the task scope.
- Add SSR-only or runtime server dependencies — the site must remain statically exportable.
- Break the `next.config.mjs` static export settings (see Critical Constraints below).

---

## Critical Constraints

These settings must not be changed. Violating them will break the production build or deployment.

### `next.config.mjs` — required options

```js
output: 'export'; // Enables static HTML export
images: {
  unoptimized: true;
} // Required for static export (no image optimization server)
trailingSlash: true; // Required for correct GitHub Pages routing
```

### Quality Gate

- The pre-commit hook (`.husky/pre-commit`) runs lint automatically.
- There is no automated test suite; lint is the enforced baseline quality check.

### Environment Variables

- `NEXT_PUBLIC_GA_TRACKING_ID` — Google Analytics tracking ID (injected at build time).
