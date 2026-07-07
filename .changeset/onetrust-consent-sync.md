---
'@gitbook/integration-onetrust': patch
---

Fix OneTrust consent not being recorded when a visitor accepts cookies. The banner's initial load no longer emits a premature rejection before the visitor answers, and an explicit Accept/Reject now always syncs to GitBook even if a prior consent decision was already recorded.
