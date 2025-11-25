---
description: Learn how to use HTTP requests in your integration
---

# Work with HTTP requests

Integrations often need to communicate with the outside world — whether that’s receiving webhooks, handling OAuth callbacks, or reacting to events emitted by GitBook itself.

GitBook’s runtime makes this possible by exposing a simple HTTP interface that your integration can receive requests from.

When your integration is deployed, GitBook automatically provisions an HTTPS endpoint that external callers can POST to. Your integration can then inspect the incoming event, react to it, and respond accordingly.

{% hint style="info" %}
#### You rarely need to handle this manually

GitBook’s SDK abstracts nearly all HTTP details for you. For most use-cases, you’ll work entirely inside the higher-level [Runtime API](../development/runtime.md) — defining actions, reacting to user events, and rendering components.

But if your integration needs to accept external events or callback payloads, it helps to understand how GitBook structures incoming requests under the hood.
{% endhint %}

### The HTTP interface

Every integration exposes a single POST endpoint:

`POST /{version} Content-Type: multipart/form-data`

The `{version}` portion of the path corresponds to the integration API version. If you’re using the GitBook CLI, versioning and backwards compatibility are handled automatically.

The request body arrives as `FormData` containing three fields:

* **event**\
  A serialized event describing what triggered this call. This is typed as `Event` from `@gitbook/api-client`.\
  It may represent an external webhook call, a GitBook-originated event, or another form of trigger.
* **environment**\
  Information about the execution environment (such as installation details or the context in which your integration is running).
* **fetch-body**\
  A raw binary buffer containing the exact body that was sent to your integration. This is especially useful for verifying webhook signatures or handling non-JSON payloads.

### Handling an incoming event

When GitBook Runtime receives an HTTP request, it parses the FormData, converts the event into a structured object, and passes it into your integration’s logic.

If you’re using the SDK, you’ll simply implement the relevant action or handler — you don’t need to manually read FormData streams or parse multipart payloads yourself.

For example, a webhook workflow usually looks like this:

1. An external service sends a POST request to your integration’s endpoint.
2. GitBook reads the FormData and extracts `event`, `environment`, and `fetch-body`.
3. Your integration’s handler receives the normalized data.
4. You run whatever logic you need — verifying signatures, syncing data, updating blocks, or triggering ContentKit components.

### Example shape of the request

Here’s a simplified model of what your integration receives:

```json
interface IncomingIntegrationRequest {
    event: Event;               // From @gitbook/api-client
    environment: IntegrationEnvironment;
    'fetch-body'?: Buffer;      // Raw request body, if present
}
```

GitBook ensures your integration receives the payload in this structured form, regardless of how the external service originally formatted the request.

#### Why this matters

Direct HTTP handling unlocks a wide range of integration patterns:

* Accepting webhooks from third-party services
* Processing OAuth redirect callbacks
* Ingesting custom events from your own backend
* Triggering content updates or re-renders in GitBook based on external state

Even though the low-level API is flexible, most integrations never need to deal with it directly. The Runtime framework takes care of routing and parsing so you can focus on your logic, not multipart headers.

If you’re building your first integration, start with the [Quickstart](../quickstart.md). Once your boilerplate is running, you can begin wiring up event handlers and external workflows as needed.
