# Markdown Negotiation

Provides a markdown representation of the homepage so agents can retrieve
clean, token-efficient content.

## Markdown Representation

Fetch the markdown version of the homepage directly:

- Markdown homepage: /index.md

It is also advertised in the HTML `<head>`:

- `<link rel="alternate" type="text/markdown" href="/index.md">`

## Content Negotiation

`Accept: text/markdown` negotiation on `/` is configured in the repository
(`vercel.json` rewrite plus `Vary: Accept`) for hosts that honor those rules.
The site is currently served from GitHub Pages, which does not apply custom
rewrites or response headers, so request `/index.md` directly there.

## Notes

- HTML remains the default representation at `/`.
- The markdown copy mirrors the homepage profile, projects, and articles.
