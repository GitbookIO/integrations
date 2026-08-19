---
"@gitbook/integration-amplitude": minor
---

Support Amplitude projects with EU data residency: a new "Server Region" option loads the SDK from the EU CDN and routes events to the EU endpoint. Previously the injected loader always used the US CDN, which rejects EU API keys with 401 "Invalid Key.", so the integration silently never initialized for EU projects.
