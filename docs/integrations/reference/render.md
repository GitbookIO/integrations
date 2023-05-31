# Render

The render method in your created component is an async callback function that allows you to read information about the element being rendered, along with other contextual information related to the component.

It can be defined in an async function inside the `createComponent` call, and includes 2 arguments:

```typescript
render: async (element, context) => {
    return (
        <block></block>
    )
},
```

### `element`

The element calling the action. This object contains the following keys:

<table><thead><tr><th width="225">Name</th><th>Description</th></tr></thead><tbody><tr><td><code>props</code></td><td>Props attached to the current instance of the component</td></tr><tr><td><code>state</code></td><td>The local state of the component</td></tr><tr><td><code>context</code></td><td>Information about the context of the component. Includes it's type, editable status, and the current theme.</td></tr><tr><td><code>setCache</code></td><td>Set the cache max-age for the output of this component.</td></tr><tr><td><code>dynamicState</code></td><td>Return an identifier for a dynamic state binding.</td></tr></tbody></table>

### `context`

Context about your integration, including the environment and installation details the integration is running in.

This object contains the following keys:

<table><thead><tr><th width="235">Name</th><th>Description</th></tr></thead><tbody><tr><td><code>environment</code></td><td>Environment of the integration. See the <a href="environment.md">Environment section</a> to learn more.</td></tr><tr><td><code>api</code></td><td>Authenticated client to the GitBook API. See the <a href="../../gitbook-api/reference/">API docs</a> to learn more.</td></tr></tbody></table>
