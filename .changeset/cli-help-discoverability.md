---
'@gitbook/cli': patch
---

Improve command discoverability: `--help` now shows a nested "Command groups" tree so subgroups like `organizations sites` are visible without drilling in; shell completion now includes the hand-written `integration` and `openapi` subcommands; and `gitbook integrations --help` points to `gitbook integration` for the build/publish lifecycle commands.
