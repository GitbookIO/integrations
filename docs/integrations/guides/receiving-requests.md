---
description: Return a JSON response from your integration's public HTTP endpoint
---

# Handle an HTTP request

This guide creates an endpoint that accepts `POST` requests. It returns a JSON confirmation.

Use this pattern for webhook receivers and callback endpoints. Add your event logic after the request succeeds.

### Before you begin

Before you start, make sure that:

* You have an integration project.
* You can configure an external service or HTTP client.

### Add a request handler

In your integration entry point, add a `fetch` handler:

```typescript
export default createIntegration({
  fetch: async (request, context) => {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    console.log("Received a request");

    return new Response(JSON.stringify({ received: true }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
});
```

The handler accepts only `POST` requests. It returns `405` for other methods.

### Deploy the integration

Deploy the version that contains the handler. GitBook gives each installation a public HTTPS endpoint.

The runtime exposes this endpoint at `context.environment.integration.urls.publicEndpoint`.

### Send a test request

In your external service or HTTP client, send a `POST` request to the public endpoint.

The endpoint returns this response:

```json
{
  "received": true
}
```

If the sender uses another HTTP method, it receives `405 Method not allowed`.

### Add your integration logic

Replace the `console.log` call with your webhook or callback logic. Keep the response fast.

For the HTTP envelope, raw request body, and response details, see [HTTP communication](../development/runtime.md#http-communication).

{% hint style="info" %}
Use the raw request body when your provider signs webhook payloads. Verify the signature before processing the event.
{% endhint %}
