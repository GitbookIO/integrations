---
'@gitbook/cli': patch
---

Generated commands now accept each path parameter as both a positional argument and a `--<name>` flag (the positional wins when both are given), with a clearer error when a required path parameter is missing. Added commands for the 5 streaming (SSE) API endpoints — `organizations ask stream`, `organizations ask questions stream`, `organizations sites ask stream`, `organizations sites ask questions stream`, and `organizations sites ai response stream` — which stream NDJSON/YAML records in machine mode and render incrementally in pretty mode. `gitbook login` now falls back to the spec-derived OAuth scope list when the server's discovery metadata omits `scopes_supported`.
