---
name: check-discovery-consistency
description: Audit the agent-discovery surface for internal consistency — .well-known documents, agent-skills sha256 hashes, WebMCP tools, and the discovery links in _document.tsx / _headers / vercel.json. Use after editing any discovery metadata, or when asked to validate the .well-known surface.
---

# Check Discovery Consistency

Read-only audit of the discovery surface (`AGENTS.md` → **Discovery Metadata**). Report drift and propose fixes; do not rewrite blindly.

## Checks

1. **agent-skills hashes** (`public/.well-known/agent-skills/`): for every `*.md`, compare `shasum -a 256 <file>` to the `skills[].sha256` in `index.json` (matched by `url` basename). Every entry must point to an existing file, and every `*.md` must have an entry.
2. **Cross-document coherence** (`public/.well-known/`): `api-catalog`, `agent-card.json`, `mcp.json`, `mcp/server-card.json`, `ai-plugin.json`, OAuth/OIDC metadata (`openid-configuration`, `oauth-authorization-server`, `oauth-protected-resource`), and `jwks.json` use consistent URLs, names, and endpoints under the `homepage` origin in `package.json`.
3. **Link agreement:** `<link>` tags in `src/pages/_document.tsx` match the `Link` header in `public/_headers` and `vercel.json`. GitHub Pages ignores the latter two, so `_document.tsx` is authoritative in production.
4. **WebMCP tools:** tools in `src/shared/utils/webmcpTools.ts` and `src/pages/_app.tsx` match `webmcp-tools.md` and `mcp.json`.

## Process

- Compare with `shasum -a 256` and `jq`; read `.md` and `.tsx` sources directly.
- Report a table: file, expected, actual, fix. Include the correct `sha256` for any drifted entry.
- After fixes, re-run the hash check to confirm.
