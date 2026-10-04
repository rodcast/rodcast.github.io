# Auth Discovery

Publish static OAuth and OIDC metadata so clients can discover the site's
advertised authentication endpoints. On the current GitHub Pages deployment,
these files do not implement registration, token exchange, revocation, or claim
operations, and the static site does not accept those requests. Read `/auth.md`
before acting.

## Endpoints

- OIDC metadata: `/.well-known/openid-configuration`
- OAuth AS metadata: `/.well-known/oauth-authorization-server`
- OAuth protected resource metadata: `/.well-known/oauth-protected-resource`
