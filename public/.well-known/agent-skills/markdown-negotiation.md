# Markdown Negotiation

Supports `Accept: text/markdown` content negotiation so agents can request
a markdown representation of the homepage.

## Content Negotiation

Send `Accept: text/markdown` with a request to `/` and receive the markdown
version of the homepage with `Content-Type: text/markdown`.

## Endpoint

- Markdown homepage: /index.md

## Headers

- `Content-Type: text/markdown; charset=utf-8`
- `x-markdown-tokens: enabled`

## Notes

- HTML remains the default browser representation.
- Requests with `Accept: text/markdown` are transparently served `/index.md`.
