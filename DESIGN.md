# DESIGN.md

Architecture decisions and rationale for rodcast.github.io.

## Architecture: Static Site on GitHub Pages

**Decision:** Next.js with `output: 'export'` deployed to GitHub Pages.

**Rationale:** The site is a personal portfolio that displays GitHub repositories and Medium articles. All data is public and is refreshed on each deploy. Static export eliminates server infrastructure, reduces cost to zero, and makes the site resilient — there is no runtime to fail.

## Data Fetching: Build-Time Only

**Decision:** All external API calls happen in `getStaticProps`, not in the browser.

**Rationale:** GitHub API and the `rss2json` Medium proxy do not require authentication or personalization. Fetching at build time means the deployed HTML already contains the data — no loading spinners for primary content, no client-side API keys, and no exposure of rate-limited endpoints to end users.

A 5-second timeout in `fetchData` prevents build hangs. If either API call fails, the page renders with empty arrays rather than crashing.

## Component Structure

```
Page (index.tsx)
├── Header         — name, title
├── Toggle         — light/dark mode
├── Sidebar        — avatar, bio, social links
├── Article        — tabbed GitHub repos + Medium articles
│   ├── GitHub     — repo cards (with GitHubSkeleton fallback)
│   └── Medium     — article cards (with MediumSkeleton fallback)
└── Footer
```

`Article` is loaded with `next/dynamic` to defer its JS bundle — it is the heaviest component and not needed for the initial paint.

## Styling: CSS Modules

**Decision:** One `.module.css` file per component; global styles only for resets and CSS variables.

**Rationale:** Scoped class names prevent collisions without a runtime CSS-in-JS library. No build-time overhead beyond what Next.js already does. The `experimental.inlineCss` flag in `next.config.mjs` inlines critical CSS into the HTML document for faster first paint.

## Discovery and Agent Metadata (`public/.well-known/`)

The site exposes a set of machine-readable discovery documents:

| File                         | Purpose                                 |
| ---------------------------- | --------------------------------------- |
| `api-catalog`                | API catalog for agent/client discovery  |
| `agent-card.json`            | Agent identity card                     |
| `agent-skills/`              | Agent capability index and skill docs   |
| `mcp/`                       | Model Context Protocol server metadata  |
| `oauth-authorization-server` | OAuth 2.0 authorization server metadata |
| `openid-configuration`       | OpenID Connect configuration            |
| `jwks.json`                  | JSON Web Key Set                        |

These are static JSON/text files committed to `public/`. They require no server. When updating any `agent-skills/*.md`, regenerate the `sha256` in `agent-skills/index.json`.

## Data Normalizers

Raw API responses are never passed directly to components. Each external source has a dedicated normalizer:

| Normalizer        | Input                    | Output      |
| ----------------- | ------------------------ | ----------- |
| `normalizeGitHub` | GitHub REST API response | `IGitHub[]` |
| `normalizeMedium` | rss2json items array     | `IMedium[]` |

If an API response shape changes, update the interface in `src/shared/interfaces/` and the normalizer together.
