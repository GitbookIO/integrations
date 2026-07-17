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

#### `button`

```tsx
<button label="Click me" onPress={{ type: 'something' }} />
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

The `data` values, together with GitBook-provided context, reach the frame through the `message` event as `event.data.state`. GitBook reserves two keys in `state`: `page` (`{ id, path, title }` of the current page — `path` is relative to the site root — always available) and `visitor` (visitor claims, with the `site:visitor:claims` scope). A webframe can also navigate the reader to another page in the site by posting a `@webframe.navigate` action with a `path`. See [Interactivity](../../contentkit/interactivity.md#page-and-visitor-context).

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
