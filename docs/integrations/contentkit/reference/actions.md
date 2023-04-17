# Actions

Actions in ContentKit components allow you to express interactivity throughout the GitBook environment. GitBook provides some default actions your components can tap into, along with the ability to create your own custom actions.

## Default Actions

### `@editor.node.updateProps`

Update the properties stored on the editor node binded to the current component. Dispatched when props are updated on a component.

```json
{
    "action": "@editor.node.updateProps",
    "props": {}
}
```

### `@ui.url.open`

An action to send to open a URL.&#x20;

```json
{
    "action": "@ui.url.open",
    "url": "https://www.gitbook.com"
}
```

### `@ui.modal.open`

Open a component `componentId` with props `props` as an overlay modal. See the Modal reference for more information.

```json
{
    "action": "@ui.modal.open",
    "componentId": "myModal",
    "props": {}
}
```

### `@ui.modal.close`

Close the current modal. This action can be called from within a modal component. It will contain return data defined in the modal. See the Modal reference for more information.

```json
{
    "action": "@ui.modal.close"
}
```

### `@webframe.ready`

Action to send as a message from a webframe to indicate that the webframe is ready to receive messages and updates.

```json
{
    "action": "@webframe.ready"
}
```

### `@webframe.resize`

Action to send as a message from a webframe to resize the container.

```json
{
    "action": "@webframe.resize",
    "aspectRatio": 1.7,
    "maxHeight": 400,
    "maxWidth": 300
}
```

### `@link.unfurl`

Action sent to the block when the user is pasting a matching url. See [Link unfurling](../../blocks/link-unfurling.md) for more details.

```json
{
    "action": "@link.unfurl",
    "url": "https://myapp.com/"
}
```

## Custom Actions

In addition to the default actions provided by GitBook, you're able to define custom actions for your components when your components are interacted with.&#x20;

Custom actions are referenced by name, and can be parsed in the [`createComponent`](../../reference/createcomponent.md) call when creating components.&#x20;

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

See the [Interactivity section](../interactivity.md) to learn more about how your components can use actions to make your integrations more interactive.
