# Fetch

The fetch method in your created integration allows you to handle incoming requests to your integration.

It can be defined in an async function inside the `createIntegration` call, and includes 2 arguments. The function should return a valid [`Response`](../runtime/apis.md).

```typescript
fetch: async (request, context) => {
    return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        } 
    }
}
```

### `request`

The incoming request object that is sent to your integration. See the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Request) to learn more.

### `context`

Context about your integration, including the environment and installation details the integration is running in.

This object contains the following keys:

<table><thead><tr><th width="235">Name</th><th>Description</th></tr></thead><tbody><tr><td><code>environment</code></td><td>Environment of the integration. See the <a href="environment.md">Environment section</a> to learn more.</td></tr><tr><td><code>api</code></td><td>Authenticated client to the GitBook API. See the <a href="../../gitbook-api/reference/">API docs</a> to learn more.</td></tr></tbody></table>
