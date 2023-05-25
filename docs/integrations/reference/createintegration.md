# createIntegration

The `createIntegration()` method is the main entry point for your app or integration. It provides the context for GitBook around how your app should look and behave.

The `createIntegration()` method can take 3 optional arguments, and must be exported from the main script executed in your app's `gitbook-manifest.yaml` file. See the [Configurations section](../configurations.md) for more info.

<table><thead><tr><th width="174.33333333333331">Argument</th><th>Type</th><th>Description</th></tr></thead><tbody><tr><td><code>fetch</code></td><td><code>function</code></td><td>An async fetch event used to communicate with the GitBook API to make requests.<br><br>See the <a href="fetch.md">Fetch</a> section to learn more.</td></tr><tr><td><code>components</code></td><td><code>array</code></td><td>The component(s) to expose in your integration. See the <a href="createcomponent.md"><code>createComponent</code></a> section for more info.</td></tr><tr><td><code>events</code></td><td><code>object</code></td><td>An object allowing you to react to GitBook events. See the <a href="event.md">Events section</a> for more information.</td></tr></tbody></table>

### Example

```typescript
export default createIntegration({
    fetch: async (element, action, context) => {},
    components: [createComponent(options)],
    events: {},
});
```
