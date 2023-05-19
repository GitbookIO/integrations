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

| Name           | Description                                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| `props`        | Props attached to the current instance of the component                                                     |
| `state`        | The local state of the component                                                                            |
| `context`      | Information about the context of the component. Includes it's type, editable status, and the current theme. |
| `setCache`     | Set the cache max-age for the output of this component.                                                     |
| `dynamicState` | Return an identifier for a dynamic state binding.                                                           |

### `context`

Context about your integration, including the environment and installation details the integration is running in.

This object contains the following keys:

| Name          | Description                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| `environment` | Environment of the integration. See the [Environment section](environment.md) to learn more.             |
| `api`         | Authenticated client to the GitBook API. See the [API docs](../../gitbook-api/reference/) to learn more. |
