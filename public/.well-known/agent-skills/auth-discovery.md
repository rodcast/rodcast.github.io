# Auth Discovery

Publish static OAuth and OIDC metadata so clients can discover the site's
advertised authentication endpoints. On the current GitHub Pages deployment,
these files do not implement registration, token exchange, revocation, or claim
operations. Read `/auth.md` before acting; do not send registration, token,
revocation, or claim requests to this static site.

## Endpoints

- OIDC metadata: `/.well-known/openid-configuration`
- OAuth AS metadata: `/.well-known/oauth-authorization-server`
- OAuth protected resource metadata: `/.well-known/oauth-protected-resource`
