---
'@gitbook/integration-slack': patch
'@gitbook/runtime': patch
---

Fixed a few bugs in the slack integration
- The channels endpoint didn't support pagination and that could lead to some unexpected behaviors due to the inherent weirdness of the slack API. See context here: https://github.com/GitbookIO/support-bucket/issues/961
- The README was missing the signing secret step for publishing an integration.
- There was a bug where the signature validation code would lock the body by reading it, which made it throw once the event tried to read from it again. Solved with a request clone.
- There was an issue in the slack manifests where we would call the events path for `url_verifications`, but that should happen under `events_task`.
