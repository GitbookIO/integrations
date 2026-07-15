---
'@gitbook/cli': minor
---

The `gitbook` CLI is now the spec-generated CLI: every GitBook API operation is available as a command group (e.g. `gitbook organizations list`), alongside shell completion (`gitbook completion`). The integration build/publish lifecycle now lives under `gitbook integration <verb>` (`new`, `dev`, `publish`, `unpublish`, `tail`, `check`); the historical top-level spellings (`gitbook publish`, …) keep working as deprecated aliases that print a warning. The separate `gitbook2` binary has been removed — it is now just `gitbook`.
