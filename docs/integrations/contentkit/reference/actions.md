# Actions

Actions in ContentKit components allow you to express interactivity throughout the GitBook environment. See the [Interactivity section](../interactivity.md) to see examples of some of the actions below.

## Actions

### `@editor.node.updateProps`

Update the properties stored on the editor node binded to the current component.

```json
{
    "action": "@editor.node.updateProps",
    "props": {}
}
```

### `@ui.url.open`

```json
{
    "action": "@ui.url.open",
    "url": "https://www.gitbook.com"
}
```

### `@ui.modal.open`

Open a component `componentId` with props `props` as an overlay modal.

```json
{
    "action": "@ui.modal.open",
    "componentId": "myModal",
    "props": {}
}
```

### `@ui.modal.close`

Close the current modal. This action should be called from within a modal component.

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
