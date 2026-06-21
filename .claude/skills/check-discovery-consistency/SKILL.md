---
name: check-discovery-consistency
description: Audit the agent-discovery surface for internal consistency — .well-known documents, agent-skills sha256 hashes, WebMCP tools, and the discovery links in _document.tsx / _headers / vercel.json. Use after editing any discovery metadata, or when asked to validate the .well-known surface.
---

# Check Discovery Consistency

This site publishes a rich agent-discovery surface. The files must stay internally consistent — `AGENTS.md` → **Discovery Metadata** treats this as a recurring obligation. This skill is a read-and-verify audit; it reports drift and proposes fixes, it does not blindly rewrite.

## What to verify

1. **agent-skills integrity** (`public/.well-known/agent-skills/`):
   - For every `*.md`, compute `shasum -a 256 <file>` and compare to the matching `skills[].sha256` in `index.json` (matched by the entry's `url` basename).
   - Every `index.json` entry must point to a file that exists; every `*.md` should have an entry.

2. **Cross-document coherence** (`public/.well-known/`):
   - `api-catalog`, `agent-card.json`, `mcp.json`, `mcp/server-card.json`, `ai-plugin.json`, OAuth/OIDC metadata (`openid-configuration`, `oauth-authorization-server`, `oauth-protected-resource`), and `jwks.json` should reference consistent URLs, names, and endpoints (all under the `homepage` origin in `package.json`).

3. **Discovery links agree across surfaces:**
   - The `<link>` discovery tags in `src/pages/_document.tsx` (the surface honored on GitHub Pages) must match the `Link` header entries in `public/_headers` and `vercel.json`. Note: GitHub Pages ignores `_headers`/`vercel.json`, so `_document.tsx` is authoritative for production.

4. **WebMCP tools:**
   - Tools registered in `src/shared/utils/webmcpTools.ts` / `src/pages/_app.tsx` should match what `webmcp-tools.md` and `mcp.json` advertise.

## How to work

- Use `shasum -a 256` and `jq` to compare hashes and JSON fields; read the `.md` and `.tsx` sources directly.
- Report findings as a table: file, expected, actual, fix. Recompute and show the correct `sha256` values for any drifted agent-skills entry.
- After applying fixes, re-run the hash check to confirm convergence.
