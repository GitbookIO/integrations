---
"@gitbook/cli": minor
---

Publishing integrations no longer requires a personal API token: `gitbook login` alone is now enough for the whole integration developer workflow, since the GitBook API exposes the integration developer endpoints to OAuth tokens through the new `integration:*` scopes. A session created before those scopes existed gets actionable guidance (naming the scopes the API says are missing) telling it to run `gitbook login` again, instead of a raw 403.
