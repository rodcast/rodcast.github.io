# Rodrigo Castilho API Documentation

This site exposes static metadata for discovery by automated clients.

## Discovery Endpoints

- `/.well-known/api-catalog` - API directory for clients and agents.
- `/.well-known/openid-configuration` - OpenID Connect metadata.
- `/.well-known/oauth-authorization-server` - OAuth authorization server metadata.
- `/.well-known/oauth-protected-resource` - OAuth protected resource metadata.
- `/.well-known/mcp/server-card.json` - MCP server discovery metadata.

## API Contract

- OpenAPI JSON: `/docs/api/openapi.json`
- Health endpoint: `/api/health`
