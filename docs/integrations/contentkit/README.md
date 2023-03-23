# ContentKit

The ContentKit framework allows you to build integrations that work from directly within the GitBook UI. It is used to define interactive layouts for Custom Blocks, Configurations flows, etc.

This means you can bring your workflows and/or product into GitBook, making it easy for teammates and customers to see information or take actions that aren't specifically to do with GitBook.

## Playground

We have an interactive playground that lets you play with ContentKit components, and see how they function in realtime. In addition to seeing how they work functionally, you're able to see examples of different components and configurations.

{% embed url="https://app.gitbook.com/dev/contentkit/" %}

## Example

The following example displays a button, that when clicked, will return a message in the component's local state that says "Hello world".

```tsx
import { createIntegration, createComponent } from '@gitbook/runtime';

const helloWorldBlock = createComponent({
    componentId: 'hello-world',
    initialState: {
        message: 'Say hello!'
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
    }
});

export default createIntegration({
    components: [helloWorldBlock]
});
```

## Creating components

Inspired by React, ContentKit relies on a core concept: Components. A component represent an element of the UI rendered with specific properties (`props`) and updated through actions impacting its local state (`state`).

Components are created using the `createComponent` method, which takes a few different options to customize it's behavior.&#x20;

### `componentId`

A unique identifier for the component in the integration.

### `initialState`

The initial state of the component.

### `action`

Callback to handle dipatched actions.

### `render`

Callback to render a component. View the [reference](reference.md) to learn more about what type of elements you can render.

## Props

## State

## Actions
