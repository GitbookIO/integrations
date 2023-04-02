# createComponent

The `createComponent()` method is the main way to create UI components for your app or integration.

The `createComponent()` method can take 4 arguments, and must be defined in the `blocks` object in your app's `gitbook-manifest.yaml` file.

Any component defined in the `blocks` object will be available in the GitBook's quick insert menu (⌘ + /)

See the [Configurations section](../configurations.md) for more info.

| Argument                                        | Description                                                                                                                 |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `componentId`<mark style="color:red;">\*</mark> | A unique identifier for the component in the integration.                                                                   |
| `initialState`                                  | An object containing the initial state of your app or integration when the page loads.                                      |
| `action`                                        | An async function to handle a dispatched action.                                                                            |
| `render`                                        | An async function that must return valid UI from ContentKit. See the [ContentKit reference](../contentkit/) for more info.  |

<mark style="color:red;">\*required</mark>

### Example

```typescript
const component = createComponent({
    componentId: 'unique-id',
    initialState: {
        message: 'Click me',
    },
    action: async (previous, action) => {
        switch (action.action) {
            case 'say':
                return { state: { message: 'Hello world' } };
        }
    },
    render: async ({ props, state }) => {
        return (
            <block>
                <button label={state.message} onPress={{ action: 'say' }} />
            </block>
        );
    },
});
```
