# createIntegration

The `createIntegration()` method is the main entry point for your app or integration. It provides the context for GitBook around how your app should look and behave.

The `createIntegration()` method can take 3 optional arguments, and must be exported from the main script executed in your app's `gitbook-manifest.yaml` file. See the [Configurations section](../configurations.md) for more info.

| Argument     | Type       | Description                                                                                                                                               |
| ------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fetch`      | `function` | <p>An async fetch event used to communicate with the GitBook API to make requests.<br><br>See the <a href="fetch.md">Fetch</a> section to learn more.</p> |
| `components` | `array`    | The component(s) to expose in your integration. See the [`createComponent`](createcomponent.md) section for more info.                                    |
| `events`     | `object`   | An object allowing you to react to GitBook events. See the [Events section](event.md) for more information.                                               |

### Example

```typescript
export default createIntegration({
    fetch: async (element, action, context) => {},
    components: [createComponent(options)],
    events: {},
});
```
