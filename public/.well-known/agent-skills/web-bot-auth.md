# Web Bot Auth

Publishes a static public-key directory for Web Bot Auth, following the
[IETF WebBotAuth WG](https://datatracker.ietf.org/wg/webbotauth/about/).

## Key Directory

- Endpoint: `/.well-known/http-message-signatures-directory`
- Content-Type: `application/http-message-signatures-directory+json`
- Key type: Ed25519 (OKP)

## Notes

- A receiving site can use this directory to look up the public key for a
  request signed with the matching private key.
- Publishing this directory does not itself mean this site signs outgoing
  requests or verifies incoming signatures.
- The key ID (`kid`) is the base64url-encoded JWK thumbprint (RFC 7638).
