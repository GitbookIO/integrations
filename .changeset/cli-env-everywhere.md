---
'@gitbook/cli': patch
---

Make `--env` a global option accepted by every command (before or after the command name), and allow `gitbook auth --env <name>` / `gitbook login --env <name>` to create a new environment instead of failing with "not found".
