# Rodrigo Castilho API Documentation

This site is a statically exported Next.js application hosted on GitHub Pages. It
exposes static metadata for discovery by automated clients. Every endpoint below
is a static file served with `GET`; there is no request-time server.

## Discovery Endpoints

- `/.well-known/api-catalog` - RFC 9727 linkset directory for clients and agents.
- `/.well-known/agent-card.json` - Agent card describing the available skills.
- `/.well-known/agent-skills/index.json` - Agent Skills index (each entry carries a `sha256`).
- `/.well-known/mcp.json` - MCP capability and schema metadata.
- `/.well-known/mcp/server-card.json` - MCP server discovery metadata.
- `/.well-known/ai-plugin.json` - AI plugin manifest pointing at the OpenAPI contract.

## Authentication Endpoints

- `/.well-known/openid-configuration` - OpenID Connect metadata.
- `/.well-known/oauth-authorization-server` - OAuth authorization server metadata.
- `/.well-known/oauth-protected-resource` - OAuth protected resource metadata.
- `/.well-known/jwks.json` - JWKS URI advertised by the authorization server metadata.
- `/auth.md` - Agent registration and token-exchange contract.

## Identity and Security

- `/.well-known/http-message-signatures-directory` - Web Bot Auth Ed25519 key directory.
- `/.well-known/security.txt` - RFC 9116 vulnerability reporting contact.

## API Contract

- OpenAPI JSON: `/docs/api/openapi.json` (OpenAPI 3.1)
- Human-readable docs: `/docs/api/`
- Health endpoint: `/api/health` — returns `{"status":"ok"}`

## Agent-Friendly Content

- `/llms.txt` - Site index for LLM clients.
- `/index.md` - Markdown representation of the homepage.
- `/feed.xml` - RSS feed.
- `/sitemap.xml` - Indexable URLs.

> On GitHub Pages, `Accept: text/markdown` content negotiation on `/` is not
> active — the `vercel.json` rewrite and `public/_headers` rules only apply on
> hosts that honor them. Fetch `/index.md` directly instead.
