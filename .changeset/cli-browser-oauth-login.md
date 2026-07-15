---
'@gitbook/cli': minor
---

Add `gitbook login` / `gitbook logout` to authenticate through the browser using OAuth, with automatic token refresh. A browser session and a personal API token can be configured at the same time: the OAuth session is used for API commands, while a personal token (via `gitbook auth --token`) is still used — and required — for publishing integrations.
