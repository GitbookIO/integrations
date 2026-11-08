---
'@gitbook/runtime': minor
'@gitbook/integration-figma': patch
'@gitbook/integration-github': patch
'@gitbook/integration-github-copilot': patch
'@gitbook/integration-github-files': patch
'@gitbook/integration-gitlab-files': patch
'@gitbook/integration-jira': patch
'@gitbook/integration-linear': patch
'@gitbook/integration-mailchimp': patch
'@gitbook/integration-slack': patch
---

`createOAuthHandler` supports OAuth transactions started by GitBook: `state` is the transaction ID, the transaction is consumed on the callback, and the credentials are written to the installation, space or site bound to it, with the `oauthTransaction` grant. Add the `pkce` option to send a PKCE challenge and verifier in these flows, enabled for the GitHub and Figma integrations. Flows started without a transaction keep the previous behaviour. Release after the API change (GitbookIO/gitbook-x#27184) is deployed and `@gitbook/api` is released with it.
