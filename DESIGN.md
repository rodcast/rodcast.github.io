# DESIGN.md

Architecture decisions and rationale for rodcast.github.io.

## Static Site on GitHub Pages

**Decision:** Next.js with `output: 'export'`, deployed to GitHub Pages.

**Rationale:** The site shows public GitHub repositories and Medium articles, refreshed on each build. Static export removes the need for a Next.js server, but browser-side interactions still execute JavaScript. The deployable artifact is `out/`; verify it locally by serving that directory statically. There is no runtime API refresh or ISR.

## Build-Time Data Fetching

**Decision:** GitHub repository and Medium article API calls happen in `getStaticProps`, not in the browser.

**Rationale:** The GitHub API and the `rss2json` Medium proxy need no authentication or personalization. The deployed HTML already contains the data, no client-side keys are needed, and visitors do not make these rate-limited requests.

`fetchData` has a 5-second timeout to prevent build hangs. Sources are fetched with `Promise.allSettled` so one failure cannot blank the other. GitHub repositories come from the live API; private and forked repositories are filtered out. If the Medium proxy fails or returns no articles, the build uses the articles in the bundled `public/feed.xml`. API failures and empty responses are logged.

GitHub has no bundled fallback: a failed request produces an empty array. The Medium fallback is read from disk at build time; a missing or unreadable feed fails the build rather than silently succeeding.

## Data Normalizers

Raw API responses never reach components.

| Normalizer            | Input                | Output      |
| --------------------- | -------------------- | ----------- |
| `normalizeGitHub`     | GitHub API response  | `IGitHub[]` |
| `normalizeMedium`     | rss2json items array | `IMedium[]` |
| `normalizeMediumFeed` | Bundled RSS feed XML | `IMedium[]` |

If a response shape changes, update the interface in `src/shared/interfaces/` and the normalizer together.

`fetchData` parses JSON; its return value is not runtime schema validation. Normalizers shape the data for the UI. `GitHub` and `Medium` require arrays and render empty-state messages when those arrays are empty.

## Component Structure

```text
Page (index.tsx)
├── Header           — h1 logo + in-page nav (#about, #github-projects, #medium-articles)
├── Toggle           — light/dark mode
├── Sidebar          — id="about"; photo, bio
│   └── SocialLinks  — GitHub, Twitter, LinkedIn, Medium (Fontello icon font)
├── Article          — GitHub repos + Medium articles
│   ├── section #github-projects → ErrorBoundary → GitHub
│   └── section #medium-articles → ErrorBoundary → Medium
└── Footer           — RSS, sitemap, source links

App (_app.tsx)
├── WebMCP tools dynamically imported on mount; registration attempted through available modelContext APIs
└── CookieConsent + GoogleAnalytics — only when NEXT_PUBLIC_GA_TRACKING_ID is set
```

The section `id`s are load-bearing: `Header` links to them and the WebMCP tools in `src/shared/utils/webmcpTools.ts` read the DOM through the same selectors. `Article` is imported directly by the page, so it is part of the initial bundle.

Both error boundaries use `ApiErrorFallback`. These boundaries handle client render errors; they do not catch `getStaticProps` failures or server-rendering errors.

## Images and Fonts

The default Next.js image optimizer needs a server, so `images.unoptimized: true` remains enabled. The profile photo is a static JPEG with 120 × 120 width/height props and CSS dimensions. These dimensions reserve layout space; they do not reduce downloaded bytes. Any compression or responsive variants must be prepared as static assets before deployment.

`src/shared/font.ts` loads the Fontello WOFF2 through `next/font/local`. `SocialLinks` and `Toggle` share it; there is no external font service.

## Styling: CSS Modules

**Decision:** One `.module.css` per component; `globals.css` only for resets, CSS variables, and shared accessibility utilities (e.g. `.sr-only`).

**Rationale:** Scoped class names avoid collisions without a runtime CSS-in-JS library or extra build overhead.

The global reduced-motion media query minimizes CSS animations and transitions. It does not override an explicit JavaScript `scrollIntoView({ behavior: 'smooth' })` request; such calls need their own preference check.

The theme pre-paint script restores a valid stored `data-theme`, otherwise choosing light. The toggle synchronizes with that value after hydration; the current default does not follow the operating-system color scheme.

## Optional Analytics

When `NEXT_PUBLIC_GA_TRACKING_ID` is set at build time, the app renders Google Analytics and the cookie-consent banner. `_document.tsx` queues denied consent defaults before Analytics loads. Accepting grants analytics storage only; advertising consent remains denied. The choice is stored under `cookie-consent`.

Analytics scripts are rendered even before acceptance when configured; denied consent is not the same as blocking all Google network requests. Without the measurement ID, neither Analytics nor the banner renders.

## Discovery and Agent Metadata

Static JSON/text files under `public/.well-known/` need no server. Entry points include the API catalog, MCP metadata, agent card, and agent-skills index; AI plugin, HTTP Message Signatures directory, and security documents sit alongside them. OAuth/OIDC endpoints and JWKS are not implemented. Do not publish metadata implying they exist. After editing any `agent-skills/*.md`, regenerate its `sha256` in `agent-skills/index.json`.

**WebMCP tools** are the browser-side part of discovery. `src/shared/utils/webmcpTools.ts` defines them and reads the rendered DOM instead of re-fetching APIs. Tools: `get-profile-summary`, `navigate-to-section`, `list-github-projects`, `list-medium-articles`. Their names must match the skill IDs in `agent-card.json` and the list in `agent-skills/webmcp-tools.md`. Static discovery documents describe capabilities; they do not create a server-side MCP transport.

**Host limitation:** on GitHub Pages, discovery relies on static files and the `<link>` tags in `_document.tsx`. The HTTP-header layer (`Link`, `Vary`, `Cache-Control`, `Accept: text/markdown` negotiation in `vercel.json` and `public/_headers`) applies only on Vercel, Cloudflare Pages, or Netlify. Fetch `/index.md` directly.
