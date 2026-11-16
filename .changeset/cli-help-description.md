---
'@gitbook/cli': patch
---

Describe the CLI as a general GitBook tool in `--help` (spaces, change requests, sites and publishing, integrations), link to the CLI, publishing, and agent setup docs from the root help, and explain that `gitbook login` needs a localhost callback, pointing remote and sandboxed environments to `gitbook auth`.

Disambiguate the `integration` and `integrations` command groups in `--help`: `integration` is for developing your own integration from local source, `integrations` is for finding and installing published integrations through the API, and each group's help points to the other.
