# ContentKit

ContentKit is a UI framework allows you to build integrations that work from directly within GitBook. It is used to define interactive layouts for Custom Blocks, Configurations flows, etc.

This means you can bring your workflows and/or product _into_ GitBook, making it easy for teammates and customers to see information or take actions that aren't specifically to do with GitBook.

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

Components are created using the `createComponent` method, which takes a few different options to customize it's behavior. See the [`createComponent`](../runtime/createcomponent.md) reference to learn more.

In addition to creating components, there are a few concepts related specifically to ContentKit and Custom Blocks that will let your integration interact with the rest of GitBook.

### Props

Props in ContentKit components are accessed in the render function of your integration. They work similarly to [props in React](https://react.dev/learn/passing-props-to-a-component), and help describe the way your component should render.&#x20;

Props are bound to your component block for all instances. To update props on a block, see [`@editor.node.updateProps`](https://developer.gitbook.com/integrations/contentkit/reference#editor.node.updateprops).

**Example**

```typescript
{
    action: "@editor.node.updateProps",
    props: {
        propMessage: "Props Updated!",
    },
};
```

### State

State in a ContentKit component is a way to keep track of data and information as it changes over time. State is bound locally to a component block, and can be updated by setting the state through an action. It's scoped to only be accessible by the component it's defined in, and works similarly to [state in React](https://react.dev/learn/state-a-components-memory).

**Example**

```typescript
{ 
    state: { 
        stateMessage: "State Updated !" 
    } 
};
```

### Actions

Actions in ContentKit components are ways to handle or respond to events that happen in the UI of your component, and help update your components state. See the [Interactivity section](interactivity.md) to learn more about handling events in your integration.
