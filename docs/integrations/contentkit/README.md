# ContentKit

The ContentKit framework allows you to build integrations that work from directly within the GitBook UI. It is used to define interactive layouts for Custom Blocks, Configurations flows, etc.

This means you can bring your workflows and/or product into GitBook, making it easy for teammates and customers to see information or take actions that aren't specifically to do with GitBook.

```contentkit
{
    "type": "button",
    "label": "Click me",
    "action": { "type": "something" }
}
```

## Example

```tsx
import { createIntegration, createComponent } from '@gitbook/runtime';

const helloWorldBlock = createComponent({
    componentId: 'hello-world',
    initialState: {
        message: 'Say hello!'
    },
    action: async (previous, action) => {
        switch (action.type) {
            case 'say':
                return { message: 'Hello world' };
            default:
                return previous;
        }
    },
    render: async ({ props, state }) => {
        return (
            <block>
                <button label={state.message} action={{ type: 'say' }} />
            </block>
        );
    }
});

export default createIntegration({
    components: [helloWorldBlock]
});
```

## Creating components

Inspired by React, ContentKit relies on a core concept: Components. A component represent an element of the UI rendered with specific properties (`props`) and updated through actions impacting its local state (`state`).

Components are being created using `createComponent`.

## Props

## State and actions

