---
'@gitbook/integration-posthog': patch
---

Fix events not being sent after accepting the cookie consent banner. The script declared `projectApiKey`, `apiHost`, `uiHost`, `GRANTED_COOKIE` and `getCookie` at the top level of the file instead of inside the wrapping function. Since all `<script>` tags on a page share the same global lexical scope, re-injecting the script after consent is granted (the first, pre-consent execution already having run and declared these `const` bindings) threw `Identifier 'projectApiKey' has already been declared` and aborted before `posthog.init` ran. Moved the declarations inside the IIFE, matching the pattern used by the other tracking integrations.
