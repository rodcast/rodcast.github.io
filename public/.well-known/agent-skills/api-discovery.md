# API Discovery

Expose the website API surface and health endpoints for automated agent discovery.

## Endpoints

- API catalog: `/.well-known/api-catalog`
- JSON-suffixed catalog fallback: `/.well-known/api-catalog.json`
- API docs: `/docs/api/`
- OpenAPI spec: `/docs/api/openapi.json`
- Health status: `/api/health.json` (legacy path: `/api/health`).

The OpenAPI contract describes only the static health probe. Profile and content
are published as HTML, Markdown, and RSS rather than as a request-time API.
Prefer `/api/health.json` over the legacy extensionless `/api/health` path when a
JSON media type is required. GitHub Pages does not apply custom response headers
to extensionless files.
