# createComponent

The `createComponent()` method is the main way to create UI components for your app or integration.

The `createComponent()` method can take 4 arguments, and must be defined in the `blocks` object in your app's `gitbook-manifest.yaml` file.

Any component defined in the `blocks` object will be available in the GitBook's quick insert menu (⌘ + /)

See the [Configurations section](../configurations.md) for more info.

| Argument                                        | Type       | Description                                                                                                                 |
| ----------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| `componentId`<mark style="color:red;">\*</mark> | `string`   | A unique identifier for the component in the integration.                                                                   |
| `initialState`                                  | `object`   | An object containing the initial state of your app or integration when the page loads.                                      |
| `action`                                        | `function` | An async function to handle a dispatched action. See the [Actions section](action.md) to learn more.                        |
| `render`                                        | `function` | An async function that must return valid UI from ContentKit. See the [ContentKit reference](../contentkit/) for more info.  |

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
                <button label={state.message} onPress={{ action: 'say' }} />
            </block>
        );
    },
});
```
