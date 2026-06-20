# Web Bot Auth

Publishes a key directory for Web Bot Auth so this site can identify itself
when it sends signed bot or agent requests per the
[IETF WebBotAuth WG](https://datatracker.ietf.org/wg/webbotauth/about/).

## Key Directory

- Endpoint: `/.well-known/http-message-signatures-directory`
- Content-Type: `application/http-message-signatures-directory+json`
- Key type: Ed25519 (OKP)

## Notes

- Receiving sites can verify signed requests from this agent using the public key
  published in the directory.
- The key ID (`kid`) is the base64url-encoded JWK thumbprint (RFC 7638).
