---
'@gitbook/cli': patch
---

Accept `--env` on every command (not just `auth`, `login` and `whoami`), and allow `gitbook auth --env <name>` / `gitbook login --env <name>` to create a new environment instead of failing with "not found".
