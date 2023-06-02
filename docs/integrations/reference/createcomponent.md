# createComponent

The `createComponent()` method is the main way to create UI components for your app or integration.

The `createComponent()` method can take 4 arguments, and must be defined in the `blocks` object in your app's `gitbook-manifest.yaml` file.

Any component defined in the `blocks` object will be available in the GitBook's quick insert menu (⌘ + /)

See the [Configurations section](../configurations.md) for more info.

<table><thead><tr><th width="230.33333333333331">Argument</th><th width="143">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>componentId</code><mark style="color:red;">*</mark></td><td><code>string</code></td><td>A unique identifier for the component in the integration.</td></tr><tr><td><code>initialState</code></td><td><code>object</code></td><td>An object containing the initial state of your app or integration when the page loads.</td></tr><tr><td><code>action</code></td><td><code>function</code></td><td>An async function to handle a dispatched action. See the <a href="action.md">Actions section</a> to learn more.</td></tr><tr><td><code>render</code></td><td><code>function</code></td><td>An async function that must return valid UI from ContentKit. See the <a href="../contentkit/">ContentKit reference</a> for more info. </td></tr></tbody></table>

<mark style="color:red;">\*required</mark>

### Example

```typescript
const component = createComponent({
    componentId: 'unique-id',
    initialState: (props) => ({
        message: 'Click me',
    }),
    action: async (element, action, context) => {
        switch (action.action) {
            case 'say':
                return { state: { message: 'Hello world' } };
        }
    },
    render: async (element, action, context) => {
        return (
            <block>
                <button label={element.state.message} onPress={{ action: 'say' }} />
            </block>
        );
    },
});
```
