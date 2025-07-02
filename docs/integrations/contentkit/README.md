---
description: Build integrations using GitBook’s UI framework.
icon: cube
---

# ContentKit

ContentKit is a UI framework allows you to build integrations that work from directly within GitBook. It is used to define interactive layouts for Custom Blocks, Configurations flows and more.

### Creating components

Components are created using the `createComponent` method, which uses a few different options to customize it's behavior. A component represents an element of the UI rendered with specific `props` and updated through actions impacting its local `state`.

In addition to creating components, there are a few concepts related specifically to ContentKit and Custom Blocks that will let your integration interact with the rest of GitBook.

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

#### Define a custom block

Blocks must defined in the integration's manifest file:

```yaml
blocks:
  - id: hello-world
    title: Hello World Block
```

All blocks defined in an installed integrations will be listed in the insertion palette for all editors of the space.

### Props

Props in ContentKit components are accessed in the render function of your integration. They work similarly to [props in React](https://react.dev/learn/passing-props-to-a-component), and help describe the way your component should render.&#x20;

Props are bound to your component block for all instances.

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

```typescript
{ 
    state: { 
        stateMessage: "State Updated !" 
    } 
};
```

### Actions

{% hint style="success" %}
&#x20;See [Creating interactive blocks](../../guides/interactivity.md) to read a guide on handling events in your integration.
{% endhint %}

Actions in components are ways to handle or respond to events that happen in the UI of your component, and help update your components state.

GitBook provides some default actions your components can tap into, along with the ability to create your own custom actions.

#### `@editor.node.updateProps`

Update the properties stored on the editor node binded to the current component. Dispatched when props are updated on a component.

```json
{
    "action": "@editor.node.updateProps",
    "props": {}
}
```

#### `@ui.url.open`

An action to send to open a URL.&#x20;

```json
{
    "action": "@ui.url.open",
    "url": "https://www.gitbook.com"
}
```

#### `@ui.modal.open`

Open a component `componentId` with props `props` as an overlay modal.

```json
{
    "action": "@ui.modal.open",
    "componentId": "myModal",
    "props": {}
}
```

#### `@ui.modal.close`

Close the current modal. This action can be called from within a modal component. It will contain return data defined in the modal.

```json
{
    "action": "@ui.modal.close"
}
```

#### `@webframe.ready`

Action to send as a message from a webframe to indicate that the webframe is ready to receive messages and updates.

```json
{
    "action": "@webframe.ready"
}
```

#### `@webframe.resize`

Action to send as a message from a webframe to resize the container.

```json
{
    "action": "@webframe.resize",
    "aspectRatio": 1.7,
    "maxHeight": 400,
    "maxWidth": 300
}
```

#### `@link.unfurl`

Action sent to the block when the user is pasting a matching url.

```json
{
    "action": "@link.unfurl",
    "url": "https://myapp.com/"
}
```

GitBook needs to know what integration can handle what specific url. To do so, integration blocks should be configured to list url patterns that can be unfurled:

<pre class="language-yaml"><code class="lang-yaml">blocks:
    - id: helloworld
      title: Hello world
<strong>      urlUnfurl:
</strong>        - https://myapp.com/
</code></pre>

{% hint style="success" %}
See [Creating a custom unfurl action](../../guides/create-a-custom-unfurl-action-for-your-integration.md) for a guide on using `@link.unfurl`.
{% endhint %}

#### Custom Actions

In addition to the default actions provided by GitBook, you're able to define custom actions for your components when your components are interacted with.&#x20;

Custom actions are referenced by name, and can be parsed in the `createComponent` call when creating components.&#x20;

The Action `name` will be sent on the `action` object:

```typescript
action: async (previous, action) => {
    switch (action.action) {
        case 'custom-action':
            return {};
        default:
    }
}
```
