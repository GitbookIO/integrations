---
'@gitbook/integration-osano': patch
---

Stop the Osano banner from disappearing on its own. Osano saves a default consent during initialization in permissive mode, and forwarding it to GitBook reloaded the page under the banner before the visitor could respond, after which Osano never showed it again. Consent is now only forwarded once the visitor has closed the dialog or drawer.
