# Rodrigo Castilho API Documentation

This site is a statically exported Next.js application hosted on GitHub Pages. Its
profile and content are available as static HTML, Markdown, and RSS. The OpenAPI
contract describes the health probe only; there is no request-time API server.

## Content Use

The site owner allows public site content to be used for AI training, search indexing, and AI inputs. `robots.txt` publishes `Content-Signal: ai-train=yes, search=yes, ai-input=yes`; see [the crawler policy](/robots.txt).

## Discovery Endpoints

- `/.well-known/api-catalog` - RFC 9727 linkset directory for clients and agents.
- `/.well-known/api-catalog.json` - JSON-suffixed linkset fallback for static hosts
  that do not assign a media type to extensionless files.
- `/.well-known/agent-card.json` - Agent card describing the available skills.
- `/.well-known/agent-skills/index.json` - Agent Skills index (each entry carries a `sha256`).
- `/.well-known/mcp.json` - MCP capability and schema metadata.
- `/.well-known/mcp/server-card.json` - MCP server discovery metadata.
- `/.well-known/ai-plugin.json` - AI plugin manifest pointing at the OpenAPI contract.

## Authentication

This static site does not provide OAuth, OpenID Connect, token exchange, or
agent registration. The `/auth.md` document describes this limitation.

## Identity and Security

- `/.well-known/http-message-signatures-directory` - Web Bot Auth Ed25519 key directory.
- `/.well-known/security.txt` - RFC 9116 vulnerability reporting contact.

## API Contract

- OpenAPI JSON: `/docs/api/openapi.json` (OpenAPI 3.1)
- Human-readable docs: `/docs/api/`
- Health endpoint: `/api/health.json` — returns `{"status":"ok"}` as JSON.
- Legacy health path: `/api/health` — retained for compatibility; use the `.json`
  path for a predictable JSON media type on GitHub Pages.

## Agent-Friendly Content

- `/llms.txt` - Site index for LLM clients.
- `/index.md` - Markdown representation of the homepage.
- `/feed.xml` - RSS feed.
- `/sitemap.xml` - Indexable HTML and documentation URLs.

> On GitHub Pages, `Accept: text/markdown` content negotiation on `/` is not
> active — the `vercel.json` rewrite and `public/_headers` rules only apply on
> hosts that honor them. Fetch `/index.md` directly instead.
