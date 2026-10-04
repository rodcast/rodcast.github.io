# DESIGN.md

Architecture decisions and rationale for rodcast.github.io.

## Static Site on GitHub Pages

**Decision:** Next.js with `output: 'export'`, deployed to GitHub Pages.

**Rationale:** The site shows public GitHub repositories and Medium articles, refreshed on each deploy. Static export removes server infrastructure and cost, and leaves no runtime to fail. The deployable artifact is `out/`; verify it locally by serving that directory statically.

## Build-Time Data Fetching

**Decision:** All external API calls happen in `getStaticProps`, never in the browser.

**Rationale:** The GitHub API and the `rss2json` Medium proxy need no authentication or personalization. The deployed HTML already contains the data, no client-side keys are needed, and rate-limited endpoints are not exposed to visitors.

`fetchData` has a 5-second timeout to prevent build hangs. Sources are fetched with `Promise.allSettled`: a failure is logged and that source becomes `[]`, while the other still renders.

## Data Normalizers

Raw API responses never reach components.

| Normalizer        | Input                    | Output      |
| ----------------- | ------------------------ | ----------- |
| `normalizeGitHub` | GitHub REST API response | `IGitHub[]` |
| `normalizeMedium` | rss2json items array     | `IMedium[]` |

If a response shape changes, update the interface in `src/shared/interfaces/` and the normalizer together.

## Component Structure

```text
Page (index.tsx)
├── Header           — h1 logo + in-page nav (#about, #github-projects, #medium-articles)
├── Toggle           — light/dark mode
├── Sidebar          — id="about"; photo, bio
│   └── SocialLinks  — GitHub, Twitter, LinkedIn, Medium (Fontello icon font)
├── Article          — GitHub repos + Medium articles
│   ├── GitHub       — id="github-projects" (ErrorBoundary → ApiErrorFallback)
│   └── Medium       — id="medium-articles" (ErrorBoundary → ApiErrorFallback)
└── Footer           — RSS, sitemap, source links

App (_app.tsx)
├── WebMCP tools registered once on mount via navigator.modelContext / document.modelContext
└── CookieConsent + GoogleAnalytics — only when NEXT_PUBLIC_GA_TRACKING_ID is set
```

The section `id`s are load-bearing: `Header` links to them and the WebMCP tools in `src/shared/utils/webmcpTools.ts` read the DOM through the same selectors. `Article` is imported directly by the page, so it is part of the initial bundle.

## Styling: CSS Modules

**Decision:** One `.module.css` per component; `globals.css` only for resets, CSS variables, and shared accessibility utilities (e.g. `.sr-only`).

**Rationale:** Scoped class names avoid collisions without a runtime CSS-in-JS library or extra build overhead.

## Discovery and Agent Metadata

Static JSON/text files under `public/.well-known/` need no server. Entry points: API catalog, MCP metadata, agent card, and agent-skills index; OAuth/OIDC, JWKS, AI plugin, HTTP Message Signatures, and security documents sit alongside them. After editing any `agent-skills/*.md`, regenerate its `sha256` in `agent-skills/index.json`.

**WebMCP tools** are the only dynamic part. `src/shared/utils/webmcpTools.ts` is the single source of truth and reads the rendered DOM instead of re-fetching APIs. Tools: `get-profile-summary`, `navigate-to-section`, `list-github-projects`, `list-medium-articles`. Their names must match the skill IDs in `agent-card.json` and the list in `agent-skills/webmcp-tools.md`.

**Host limitation:** on GitHub Pages, discovery relies on static files and the `<link>` tags in `_document.tsx`. The HTTP-header layer (`Link`, `Vary`, `Cache-Control`, `Accept: text/markdown` negotiation in `vercel.json` and `public/_headers`) applies only on Vercel, Cloudflare Pages, or Netlify. Fetch `/index.md` directly.
