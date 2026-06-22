# DESIGN.md

Architecture decisions and rationale for rodcast.github.io.

## Architecture: Static Site on GitHub Pages

**Decision:** Next.js with `output: 'export'` deployed to GitHub Pages.

**Rationale:** The site is a personal portfolio that displays GitHub repositories and Medium articles. All data is public and is refreshed on each deploy. Static export eliminates server infrastructure, reduces cost to zero, and makes the site resilient — there is no runtime to fail.

The deployable artifact is the generated `out/` directory. Any local verification of the exported site should serve that directory as static files.

## Data Fetching: Build-Time Only

**Decision:** All external API calls happen in `getStaticProps`, not in the browser.

**Rationale:** GitHub API and the `rss2json` Medium proxy do not require authentication or personalization. Fetching at build time means the deployed HTML already contains the data, avoids client-side API keys, and reduces exposure of rate-limited endpoints to end users.

A 5-second timeout in `fetchData` prevents build hangs. If either API call fails, the page renders with empty arrays rather than crashing.

## Component Structure

```text
Page (index.tsx)
├── Header         — name, title
├── Toggle         — light/dark mode
├── Sidebar        — avatar, bio, social links
├── Article        — GitHub repos + Medium articles
│   ├── GitHub     — repo cards (wrapped in ErrorBoundary → ApiErrorFallback)
│   └── Medium     — article cards (wrapped in ErrorBoundary → ApiErrorFallback)
└── Footer

App (_app.tsx)
└── Registers WebMCP tools through `navigator.modelContext` and `document.modelContext`, retrying briefly while those APIs initialize
```

`Article` is loaded with `next/dynamic` to defer its JS bundle — it is the heaviest component and not needed for the initial paint.

## Styling: Tailwind CSS v4

**Decision:** Utility classes inline on components. `src/styles/globals.css` holds the single `@import "tailwindcss"`, the runtime theme tokens (`:root` + `html[data-theme='dark']`), a `dark` custom variant mapped to that attribute, the logo keyframe animation (`@theme --animate-fade-bg`), the reusable fontello `icon-*` utilities, and the accessibility utilities/resets (e.g. `.sr-only`). No `*.module.css` files remain.

**Rationale:** Tailwind v4 is CSS-first (no `tailwind.config.js`, no `content` globs) and compiles to a plain static CSS file at build time — fully compatible with `output: 'export'` and adds no runtime. Color tokens that the theme toggle swaps at runtime stay as live CSS custom properties referenced via arbitrary values (`bg-[var(--secondary-color)]`) rather than frozen into `@theme`, so theme switching keeps working. The font-icon glyph set and the keyframe animation are the two patterns that can't be pure inline utilities, so they live as named `@utility`/`@theme` entries in the global stylesheet.

## Discovery and Agent Metadata (`public/.well-known/`)

The site exposes static discovery metadata under `public/.well-known/`. The main entry points are the API catalog, MCP metadata, agent card, and agent skills index; related OAuth/OIDC, JWKS, AI plugin, HTTP Message Signatures, and security documents live alongside them.

These are committed static JSON/text files under `public/`. They require no server. When updating any `agent-skills/*.md`, regenerate the `sha256` in `agent-skills/index.json`.

**Host limitation:** discovery here relies on static files and the `<link>` tags in `_document.tsx`. The HTTP-header layer (`Link`, `Vary`, `Cache-Control`, and `Accept: text/markdown` negotiation defined in `vercel.json` and `public/_headers`) is **not honored by GitHub Pages** — it applies only if the site is served from Vercel/Cloudflare Pages/Netlify. On GitHub Pages, fetch markdown directly at `/index.md`.

## Data Normalizers

Raw API responses are never passed directly to components. Each external source has a dedicated normalizer:

| Normalizer        | Input                    | Output      |
| ----------------- | ------------------------ | ----------- |
| `normalizeGitHub` | GitHub REST API response | `IGitHub[]` |
| `normalizeMedium` | rss2json items array     | `IMedium[]` |

If an API response shape changes, update the interface in `src/shared/interfaces/` and the normalizer together.
