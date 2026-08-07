# DESIGN.md

Architecture decisions and rationale for rodcast.github.io.

## Architecture: Static Site on GitHub Pages

**Decision:** Next.js with `output: 'export'` deployed to GitHub Pages.

**Rationale:** The site is a personal portfolio that displays GitHub repositories and Medium articles. All data is public and is refreshed on each deploy. Static export eliminates server infrastructure, reduces cost to zero, and makes the site resilient — there is no runtime to fail.

The deployable artifact is the generated `out/` directory. Any local verification of the exported site should serve that directory as static files.

## Data Fetching: Build-Time Only

**Decision:** All external API calls happen in `getStaticProps`, not in the browser.

**Rationale:** GitHub API and the `rss2json` Medium proxy do not require authentication or personalization. Fetching at build time means the deployed HTML already contains the data, avoids client-side API keys, and reduces exposure of rate-limited endpoints to end users.

A 5-second timeout in `fetchData` prevents build hangs. The two sources are fetched with `Promise.allSettled`, so a failure is isolated per source: the rejection is logged and that source becomes an empty array while the other still renders.

## Component Structure

```text
Page (index.tsx)
├── Header             — h1 logo + in-page nav (#about, #github-projects, #medium-articles)
├── Toggle             — light/dark mode
├── Sidebar            — id="about"; photo, bio
│   └── SocialLinks    — GitHub, Twitter, LinkedIn, Medium (Fontello icon font)
├── Article            — GitHub repos + Medium articles
│   ├── GitHub         — id="github-projects" (wrapped in ErrorBoundary → ApiErrorFallback)
│   └── Medium         — id="medium-articles" (wrapped in ErrorBoundary → ApiErrorFallback)
└── Footer             — RSS, sitemap, source links

App (_app.tsx)
├── Registers WebMCP tools through `navigator.modelContext` and `document.modelContext`,
│   retrying up to 5 times at 500ms while those APIs initialize
└── CookieConsent + GoogleAnalytics — rendered only when NEXT_PUBLIC_GA_TRACKING_ID is set
```

The section `id`s above are load-bearing: `Header` links to them, and the WebMCP tools in
`src/shared/utils/webmcpTools.ts` read the DOM through those same selectors.

`Article` is loaded with `next/dynamic` to defer its JS bundle — it is the heaviest component and not needed for the initial paint.

## Styling: CSS Modules

**Decision:** One `.module.css` file per component; global styles only for resets, CSS variables, and a minimal set of accessibility utilities (e.g. `.sr-only`).

**Rationale:** Scoped class names prevent collisions without a runtime CSS-in-JS library. No build-time overhead beyond what Next.js already does. A small number of accessibility utilities like `.sr-only` are intentionally global so they can be reused across components without duplication.

## Discovery and Agent Metadata (`public/.well-known/`)

The site exposes static discovery metadata under `public/.well-known/`. The main entry points are the API catalog, MCP metadata, agent card, and agent skills index; related OAuth/OIDC, JWKS, AI plugin, HTTP Message Signatures, and security documents live alongside them.

These are committed static JSON/text files under `public/`. They require no server. When updating any `agent-skills/*.md`, regenerate the `sha256` in `agent-skills/index.json`.

**WebMCP tools** are the one dynamic part of this surface: `src/shared/utils/webmcpTools.ts` is the single source of truth, and it reads the rendered DOM rather than re-fetching the APIs. It currently defines `get-profile-summary`, `navigate-to-section`, `list-github-projects`, and `list-medium-articles`. Those names must stay aligned with the skill IDs in `agent-card.json` and the tool list in `agent-skills/webmcp-tools.md`.

**Host limitation:** discovery here relies on static files and the `<link>` tags in `_document.tsx`. The HTTP-header layer (`Link`, `Vary`, `Cache-Control`, and `Accept: text/markdown` negotiation defined in `vercel.json` and `public/_headers`) is **not honored by GitHub Pages** — it applies only if the site is served from Vercel/Cloudflare Pages/Netlify. On GitHub Pages, fetch markdown directly at `/index.md`.

## Data Normalizers

Raw API responses are never passed directly to components. Each external source has a dedicated normalizer:

| Normalizer        | Input                    | Output      |
| ----------------- | ------------------------ | ----------- |
| `normalizeGitHub` | GitHub REST API response | `IGitHub[]` |
| `normalizeMedium` | rss2json items array     | `IMedium[]` |

If an API response shape changes, update the interface in `src/shared/interfaces/` and the normalizer together.
