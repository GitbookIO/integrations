---
description: Learn about the components available from ContentKit
---

# Component reference

Here you’ll find the component reference for all of the ContentKit blocks you can use in your components. Components are divided into 3 different categories:

* **Layout**: Components for structuring your integration
* **Display**: Visual components for representing data and media
* **Interactive**: Interactive components

### Layout

#### `block`

Top level component for a custom block.

```tsx
<block>
    ...
</block>
```

| Props                      | Type                    | Description                                         |
| -------------------------- | ----------------------- | --------------------------------------------------- |
| `children`\*               | `Array<Block>`          | Content to display in the block.                    |
| `controls`                 | `Array<BlockControl>`   | Control menu items displayed for the block.         |
| `controls.icon`            | `'close' \| ...`        | The icon to display with the control                |
| `controls.label`           | `string`                | The label for the control                           |
| `controls.onPress`         | `Action`                | Action dispatched when control is pressed.          |
| `controls.confirm`         | `object`                | Modal object to confirm the action before execution |
| `controls.confirm.title`   | `string`                | Title for the confirmation button                   |
| `controls.confirm.text`    | `string`                | Content for the confirmation button                 |
| `controls.confirm.confirm` | `string`                | Label for the confirmation button                   |
| `controls.confirm.style`   | `"primary" \| "danger"` | Style for the confirmation button                   |

#### `vstack`

Flex layout element to render a vertical stack of elements.

```tsx
<vstack>
    ...
</vstack>
```

| Props        | Type                           | Description                                    |
| ------------ | ------------------------------ | ---------------------------------------------- |
| `children`\* | `Array<Block>`                 | Content to display in the stack.               |
| `align`      | `'start' \| 'center' \| 'end'` | Horizontal alignment of the elements in stack. |

#### `hstack`

Flex layout element to render a horizontal stack of elements.

```tsx
<hstack>
    ...
</hstack>
```

| Props        | Type                           | Description                                  |
| ------------ | ------------------------------ | -------------------------------------------- |
| `children`\* | `Array<Block>`                 | Content to display in the stack.             |
| `align`      | `'start' \| 'center' \| 'end'` | Vertical alignment of the elements in stack. |

#### `divider`

A visual delimiter between 2 elements of a containing stack layout.

```tsx
<divider />
```

| Props   | Type                             | Description                                   |
| ------- | -------------------------------- | --------------------------------------------- |
| `style` | `"default" \| "line"`            | Visual style for the divider.                 |
| `size`  | `"medium" \| "small" \| "large"` | Spacing of the divider (default to `medium`). |

### Display

#### `box`

```tsx
<box style="card">
    ...
</box>
```

| Props        | Type                            | Description                                            |
| ------------ | ------------------------------- | ------------------------------------------------------ |
| `children`\* | `Array<Block> \| Array<Inline>` | Content to display in the box.                         |
| `grow`       | `number`                        | Portion of remaining space the element should take up. |

#### `card`

```tsx
<card title="I am a card">
    ...
</card>
```

| Props      | Type                            | Description                                        |
| ---------- | ------------------------------- | -------------------------------------------------- |
| `children` | `Array<Block> \| Array<Inline>` | Content to display in the card.                    |
| `title`    | `string`                        | Title for the card.                                |
| `hint`     | `string`                        | Hint for the card.                                 |
| `icon`     | `'close' \| ...`                | Icon or Image displayed with the card.             |
| `onPress`  | `Action`                        | Action dispatched when pressed.                    |
| `buttons`  | `Array<Button>`                 | Buttons shown in the top-right corner of the card. |

#### `text`

```tsx
<text>
    Hello <text style="bold">World</text>
</text>
```

| Props        | Type                                              | Description      |
| ------------ | ------------------------------------------------- | ---------------- |
| `children`\* | `Array<string \| Text>`                           | Text content     |
| `style`\*    | `"bold" \| "italic" \| "strikethrough" \| "code"` | Formatting style |

#### `image`

```tsx
<image 
    source={{ url: "https://example.com/image.png" }}
    aspectRatio={16 / 9}
/>
```

| Props           | Type     | Description               |
| --------------- | -------- | ------------------------- |
| `source`\*      | `object` | Image source              |
| `source.url`\*  | `string` | URL of the image          |
| `aspectRatio`\* | `number` | Aspect ratio of the image |

#### `markdown`

```tsx
<markdown content="Hello **world**" />
```

| Props       | Type     | Description                  |
| ----------- | -------- | ---------------------------- |
| `content`\* | `string` | Markdown content to display. |

### Interactive

#### `modal`

```tsx
<modal>
    ...
</modal>
```

| Props         | Type                                   | Description                        |
| ------------- | -------------------------------------- | ---------------------------------- |
| `children`\*  | `Array<Block> \| Array<Inline>`        | Modal content                      |
| `title`       | `string`                               | Modal title                        |
| `subtitle`    | `string`                               | Modal subtitle                     |
| `size`        | `'medium' \| 'xlarge' \| 'fullscreen'` | Modal size                         |
| `returnValue` | `object`                               | Data returned when modal is closed |
| `submit`      | `Button`                               | Submit button                      |

Dispatch `@ui.modal.open` from a button to render a modal component:

```tsx
<button
    label="Open modal"
    onPress={{
        action: '@ui.modal.open',
        componentId: 'custommodal',
        props: {
            message: 'Hello world'
        }
    }}
/>
```

The modal component receives the defined props. Dispatch `@ui.modal.close` to close it. The action can include `returnValue`, which the parent component receives in its action handler.

Follow [Open a modal from a button](../../guides/open-a-modal-from-a-button.md) for a complete example.

#### `button`

```tsx
<button label="Update text" onPress={{ action: 'update-message' }} />
```

| Props               | Type                                   | Description               |
| ------------------- | -------------------------------------- | ------------------------- |
| `label`\*           | `string`                               | Button text               |
| `onPress`\*         | `Action`                               | Triggered action          |
| `style`             | `'primary' \| 'secondary' \| 'danger'` | Button style              |
| `tooltip`           | `string`                               | Hover tooltip             |
| `icon`              | `'close' \| ...`                       | Icon to display           |
| `confirm`           | `object`                               | Confirmation modal        |
| `confirm.title`\*   | `string`                               | Confirmation modal title  |
| `confirm.text`\*    | `string`                               | Confirmation text         |
| `confirm.confirm`\* | `string`                               | Confirmation button label |
| `confirm.style`\*   | `'primary' \| 'danger'`                | Confirmation button style |

Use `onPress` to dispatch an action. Handle custom actions in the component `action` callback:

```tsx
<button
    label="Update text"
    onPress={{
        action: 'update-message'
    }}
/>
```

Use `@ui.url.open` to open an external URL:

```tsx
<button
    label="Open GitBook"
    onPress={{
        action: '@ui.url.open',
        url: 'https://www.gitbook.com'
    }}
/>
```

Follow [Update text with a button](../../guides/interactivity.md) for a complete custom-action example.

#### `textinput`

```tsx
<textinput
    id="name"
    label="Name"
    initialValue="John Doe"
    placeholder="Enter a name"
/>
```

| Props          | Type     | Description           |
| -------------- | -------- | --------------------- |
| `state`\*      | `string` | State key for binding |
| `initialValue` | `string` | Initial input value   |
| `label`        | `string` | Input label           |
| `placeholder`  | `string` | Placeholder text      |

The `state` value identifies where ContentKit stores the input value. Your action handler can read that value from the component state.

Use `@editor.node.updateProps` to save the current input value as a block property:

```tsx
<button
    label="Save content"
    onPress={{
        action: '@editor.node.updateProps',
        props: {
            content: element.dynamicState('content')
        }
    }}
/>
```

Follow [Create an interactive text input](../../guides/create-an-interactive-text-input.md) to build a text input with an action. Follow [Save editable block content](../../guides/save-editable-block-content.md) to save its value.

#### `codeblock`

```tsx
<codeblock content="const variable = 10" syntax="javascript" />
```

| Props             | Type                | Description                                 |
| ----------------- | ------------------- | ------------------------------------------- |
| `content`\*       | `string`            | Code content                                |
| `syntax`          | `string`            | Code syntax highlight                       |
| `lineNumbers`     | `boolean \| number` | Show line numbers                           |
| `buttons`         | `Array<Button>`     | Overlay buttons                             |
| `state`           | `string`            | Makes block editable, value stored in state |
| `onContentChange` | `Action`            | Action on edit                              |

Use `codeblock` when you need a prompt-style block.

It renders with the same visual treatment as a code block. This works well for prompts, commands, and other text readers might want to reuse in another tool.

ContentKit does not currently expose a dedicated `prompt` component. It also does not define a built-in AI-tool action for `codeblock`.

You can build the closest equivalent by adding overlay buttons. For example, you can add a button that opens a prompt target URL in Cursor using `@ui.url.open`.

```tsx
<codeblock
    content={prompt}
    buttons={[
        {
            icon: 'arrow-up-right-from-square',
            tooltip: 'Open in Cursor',
            onPress: {
                action: '@ui.url.open',
                url: cursorUrl
            }
        }
    ]}
/>
```

In this example, `cursorUrl` is a URL or deeplink your integration generates for the target AI tool.

If you need a copy button, only add it when your integration has a supported way to handle copy behavior. ContentKit does not document a built-in clipboard action for `codeblock` buttons today.

#### `webframe`

```tsx
<webframe
    source={{ url: 'https://www.gitbook.com' }}
    aspectRatio={16 / 9}
/>
```

| Props           | Type                     | Description              |
| --------------- | ------------------------ | ------------------------ |
| `source`\*      | `object`                 | URL source               |
| `source.url`\*  | `string`                 | URL of the external site |
| `aspectRatio`\* | `number`                 | Aspect ratio             |
| `buttons`       | `Array<Button>`          | Overlay buttons          |
| `data`          | `Record<string, string>` | State dependencies       |

Pass component state through `data`. Use `dynamicState` when the frame needs updates as the reader interacts:

```tsx
<webframe
    source={{ url: '/iframe.html' }}
    data={{
        content: element.dynamicState('content')
    }}
/>
```

The frame receives bound data and GitBook context through the `message` event:

```javascript
window.addEventListener('message', (event) => {
    const state = event.data?.state;
    if (!state) return;

    const content = state.content;
    const page = state.page;
});
```

GitBook always provides `state.page` as `{ id, path, title }`. GitBook provides `state.visitor` when the integration has the `site:visitor:claims` [scope](../../configurations.md#scopes).

The frame can dispatch a custom action to the component:

```javascript
window.parent.postMessage({
    action: {
        type: 'doSomething'
    }
}, '*');
```

The frame can navigate within the published site with `@webframe.navigate`:

```javascript
window.parent.postMessage({
    action: {
        action: '@webframe.navigate',
        path: 'guides/getting-started',
        anchor: 'installation'
    }
}, '*');
```

The `path` starts after the site's base URL. The optional `anchor` scrolls to a heading on the target page.

Follow [Send data to a webframe](../../guides/send-data-to-a-webframe.md) for a complete example.

#### `select`

```tsx
<select state>
    ...
</select>
```

| Props           | Type                 | Description              |
| --------------- | -------------------- | ------------------------ |
| `state`\*       | `string`             | State key                |
| `initialValue`  | `string \| string[]` | Initial selected value   |
| `placeholder`   | `string`             | Placeholder              |
| `multiple`      | `boolean`            | Allow multiple selection |
| `options`       | `Array<object>`      | Selectable options       |
| `options.id`    | `string`             | Option ID                |
| `options.label` | `string`             | Option label             |
| `options.url`   | `string`             | Option external link     |

#### `switch`

```tsx
<switch />
```

| Props               | Type                    | Description               |
| ------------------- | ----------------------- | ------------------------- |
| `state`\*           | `string`                | State key                 |
| `initialValue`      | `boolean`               | Initial value             |
| `confirm.title`\*   | `string`                | Confirmation title        |
| `confirm.text`\*    | `string`                | Confirmation text         |
| `confirm.confirm`\* | `string`                | Confirmation button label |
| `confirm.style`\*   | `'primary' \| 'danger'` | Confirmation style        |

#### `checkbox`

```tsx
<checkbox />
```

| Props               | Type                    | Description               |
| ------------------- | ----------------------- | ------------------------- |
| `state`\*           | `string`                | State key                 |
| `value`             | `string \| number`      | Value when checked        |
| `confirm.title`\*   | `string`                | Confirmation title        |
| `confirm.text`\*    | `string`                | Confirmation text         |
| `confirm.confirm`\* | `string`                | Confirmation button label |
| `confirm.style`\*   | `'primary' \| 'danger'` | Confirmation style        |

#### `radio`

```tsx
<radio />
```

| Props               | Type                    | Description               |
| ------------------- | ----------------------- | ------------------------- |
| `state`\*           | `string`                | State key                 |
| `value`             | `string \| number`      | Value when selected       |
| `confirm.title`\*   | `string`                | Confirmation title        |
| `confirm.text`\*    | `string`                | Confirmation text         |
| `confirm.confirm`\* | `string`                | Confirmation button label |
| `confirm.style`\*   | `'primary' \| 'danger'` | Confirmation style        |
