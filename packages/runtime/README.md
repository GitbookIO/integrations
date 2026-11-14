# Expected integration failures

Use `IntegrationError` only after your integration has identified a known failure that an administrator or caller can fix:

```ts
import { IntegrationError } from '@gitbook/runtime';

// In a branch that has verified the provider rejected the installation credentials:
throw new IntegrationError('authentication_required');
```

The supported reasons are `authentication_required` (HTTP 424), `configuration_required` (HTTP 424) and `invalid_input` (HTTP 422). Messages are fixed and contain recovery guidance. Do not pass provider responses, OAuth credentials, or customer input to this error. An upstream 401 can identify rejected credentials; an upstream 403 requires checking the provider's documented error code to distinguish an invalid refresh token from an outage or another failure. An upstream 422 alone does not establish that the caller's input is wrong.

Do not infer a reason from arbitrary exception text, or classify every JSON parsing failure as invalid input. Preserve unexpected crashes, timeouts, network failures and upstream outages as ordinary exceptions. This API does not retry an event or roll back actions that already ran.

The runtime responds with the existing `error` string plus `integrationError: { version: 1, code: reason }`. Older GitBook API versions can still read the string and status. Newer versions validate the envelope and use their own public messages. No 5xx response is downgraded using this metadata. Existing `ExposableError` responses remain supported; for non-fetch events, their 401/403 statuses become 424 so they cannot be mistaken for a GitBook login failure. Fetch handlers keep control of their status and body.

Integrations must adopt the error explicitly and publish a new bundle before it affects their failures. Updating this package or the GitBook API does not repair stored credentials or reconnect an account.
