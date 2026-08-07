# WebMCP Tools

Expose key profile site actions through the WebMCP browser integration. The tools
are registered on the homepage via `navigator.modelContext` /
`document.modelContext` and read the rendered page, so they reflect what is
currently on screen.

## Tools

- `get-profile-summary`: Returns the visible profile summary and social links
  from the about section. No input.
- `navigate-to-section`: Scrolls the page to a known section. Required input
  `section`, one of `about`, `github-projects`, `medium-articles`.
- `list-github-projects`: Returns the GitHub repositories rendered in the
  projects section. Optional input `limit` (1-20, default 6).
- `list-medium-articles`: Returns the Medium articles rendered in the articles
  section. Optional input `limit` (1-10, default 5).

## Notes

- All tools except `navigate-to-section` are annotated `readOnlyHint: true`.
- Tool IDs match the `skills[].id` values in
  `/.well-known/agent-card.json`.
