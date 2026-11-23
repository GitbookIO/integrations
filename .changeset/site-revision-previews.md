---
'@gitbook/api': minor
'@gitbook/cli': patch
---

Regenerate the API client and CLI from the current OpenAPI schema. Adds the endpoints that read a site's content and OpenAPI specs at a site revision, and `siteRevision` on resolved site content. `PublishedSiteContent` now types `revision`, `changeRequest` and `siteRevision` as mutually exclusive, so narrow the content before reading one of them.
