# Components

Our reference for the ContentKit covers all the objects you will receive and respond with, alongside all the components you can use in order to render the UI for your integrations.

If you want to learn more about the ContentKit itself, alongside the different types of requests we make in order to make these work, please take a look at our [introduction](./).

Components are divided into 3 different categories:

* **Layout**: Components for structuring your integration
* **Display**: Visual components for representing data and media
* **Interactive**: Interactive components

## Layout

### `block`

Top level component for a custom block.

{% tabs %}
{% tab title="JSX" %}
```tsx
<block>
    ...
</block>
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "block",
    "children": [
        ...
    ]
}
```
{% endtab %}
{% endtabs %}

| Props                                        | Type                                                                                                                                                           | Description                                                                                                                    |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `children`<mark style="color:red;">\*</mark> | `Array<Block>`                                                                                                                                                 | Content to display in the block.                                                                                               |
| `controls`                                   | `Array<BlockControl>`                                                                                                                                          | <p>Control menu items displayed for the block.<br></p>                                                                         |
| `controls.icon`                              | <pre><code>'close' |
'edit' |
'github' |
'maximize' |
'email' |
'settings' |
'search' |
'delete' |
'star' |
'warning' |
'link' |
'link-external'
</code></pre> | The icon to display with the control                                                                                           |
| `controls.label`                             | `string`                                                                                                                                                       | The label for the control                                                                                                      |
| `controls.onPress`                           | `Action`                                                                                                                                                       | <p>Action dispatched when control is pressed. <br><br>See <a href="reference/actions.md">Actions</a> for more information.</p> |
| `controls.confirm`                           | `object`                                                                                                                                                       | Modal object to display to ask the user to confirm the action before execution                                                 |
| `controls.confirm.title`                     | `string`                                                                                                                                                       | Title for the confirmation button                                                                                              |
| `controls.confirm.text`                      | `string`                                                                                                                                                       | Content for the confirmation button                                                                                            |
| `controls.confirm.confirm`                   | `string`                                                                                                                                                       | Label for the confirmation button                                                                                              |
| `controls.confirm.style`                     | `"primary"` \| `"danger"`                                                                                                                                      | Style for the confirmation button.                                                                                             |

<mark style="color:red;">\*required</mark>



### `vstack`

Flex layout element to render a vertical stack of elements. Use [`spacer`](reference.md#spacer), [`divider`](reference.md#divider), and [`box`](reference.md#box) to complete the layout.

{% tabs %}
{% tab title="JSX" %}
```tsx
<vstack style="start">
    ...
</vstack>
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "vstack",
    "align": "start",
    "children": [
        ...
    ]
}
```
{% endtab %}

{% tab title="Examples" %}
Basic vertical stack:

```
{
    "type": "vstack",
    "children": [
        { "type": "box", "children": [ { "type": "text", "children": ["Hello"] } ] },
        { "type": "box", "children": [ { "type": "text", "children": ["World"] } ] }
    ]
}
```

with `align`:

```
{
    "type": "vstack",
    "align": "center",
    "children": [
        { "type": "box", "children": [ { "type": "text", "children": ["Hello"] } ] },
        { "type": "box", "children": [ { "type": "text", "children": ["And a long text"] } ] }
    ]
}
```
{% endtab %}
{% endtabs %}

| Props                                        | Type                           | Description                                        |
| -------------------------------------------- | ------------------------------ | -------------------------------------------------- |
| `children`<mark style="color:red;">\*</mark> | `Array<Block>`                 | Content to display in the stack.                   |
| `align`                                      | `'start' \| 'center' \| 'end'` | Horizontal alignment of the elements in the stack. |

<mark style="color:red;">\*required</mark>



### `hstack`

Flex layout element to render an horizontal stack of elements. Use [`spacer`](reference.md#spacer), [`divider`](reference.md#divider), and [`box`](reference.md#box) to complete the layout.

{% tabs %}
{% tab title="JSX" %}
```tsx
<hstack style="start">
    ...
</hstack>
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "hstack",
    "align": "start",
    "children": [
        ...
    ]
}
```
{% endtab %}

{% tab title="Examples" %}
Basic horizontal stack:

```
{
    "type": "hstack",
    "children": [
        { "type": "box", "children": [ { "type": "text", "children": ["Hello"] } ] },
        { "type": "box", "children": [ { "type": "text", "children": ["World"] } ] }
    ]
}
```

with `align`:

```
{
    "type": "hstack",
    "align": "center",
    "children": [
        { "type": "box", "children": [ { "type": "text", "children": ["Hello"] } ] },
        { "type": "box", "children": [ { "type": "text", "children": ["And a long text"] } ] }
    ]
}
```
{% endtab %}
{% endtabs %}

| Props                                        | Type                           | Description                                      |
| -------------------------------------------- | ------------------------------ | ------------------------------------------------ |
| `children`<mark style="color:red;">\*</mark> | `Array<Block>`                 | Content to display in the stack.                 |
| `align`                                      | `'start' \| 'center' \| 'end'` | Vertical alignment of the elements in the stack. |

<mark style="color:red;">\*required</mark>



### `spacer`

A flexible space that expands along the major axis of its containing stack layout, or on both axes if not contained in a stack.

{% tabs %}
{% tab title="JSX" %}
```tsx
<spacer />
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "spacer"
}
```
{% endtab %}
{% endtabs %}



### `divider`

A visual delimiter between 2 elements of a containing stack layout.

{% tabs %}
{% tab title="JSX" %}
```tsx
<divider />
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "divider"
}
```
{% endtab %}
{% endtabs %}

| Props   | Type                             | Description                                   |
| ------- | -------------------------------- | --------------------------------------------- |
| `style` | `"default" \| "line"`            | Visual style for the divider.                 |
| `size`  | `"medium" \| "small" \| "large"` | Spacing of the divider (default to `medium`). |



## Display

### `box`

{% tabs %}
{% tab title="JSX" %}
```tsx
<box style="card">
    ...
</box>
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "box",
    "style": "card",
    "children": [
        ...
    ]
}
```
{% endtab %}
{% endtabs %}

| Props                                        | Type                                 | Description                                                                                   |
| -------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------- |
| `children`<mark style="color:red;">\*</mark> | `Array<Block> \| Array<Inline>`      | Content to display in the block.                                                              |
| `style`                                      | `'card' \| 'secondary' \| 'default'` | Visual style for the box.                                                                     |
| `grow`                                       | `number`                             | Specifies how much of the remaining space in the container should be assigned to the element. |

<mark style="color:red;">\*required</mark>



### `card`

{% tabs %}
{% tab title="JSX" %}
```tsx
<card title="I am a card">
    ...
</card>
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "card",
    "text": "I am a card",
    "children": [
        ...
    ]
}
```
{% endtab %}
{% endtabs %}

| Props      | Type                                                                                                                                                                                                                       | Description                                              |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `children` | `Array<Block> \| Array<Inline>`                                                                                                                                                                                            | Content to display in the block.                         |
| `title`    | `string`                                                                                                                                                                                                                   | Title for the card.                                      |
| `hint`     | `string`                                                                                                                                                                                                                   | Hint for the card.                                       |
| `icon`     | <pre class="language-typescript"><code class="lang-typescript">'close' |
'edit' |
'github' |
'maximize' |
'email' |
'settings' |
'search' |
'delete' |
'star' |
'warning' |
'link' |
'link-external' |
Image
</code></pre> | Icon or Image displayed with the card.                   |
| `onPress`  | `Action`                                                                                                                                                                                                                   | Action dispatched when pressed.                          |
| `buttons`  | `Array<Button>`                                                                                                                                                                                                            | Button(s) displayed in the top right corner of the card. |

<mark style="color:red;">\*required</mark>



### `text`

The text element is used for rendering blocks of text **with** formatting.

{% tabs %}
{% tab title="JSX" %}
```tsx
<text>
    Hello <text style="bold">World</text>
</text>
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "text",
    "children": [
        "Hello ",
        {
            "type": "text",
            "children": ["World"],
            "style": "bold"
        }
    ]
}
```
{% endtab %}

{% tab title="Examples" %}
Basic text:

```
{
    "type": "text",
    "children": ["Hello"]
}
```

With nested formatting:

```
{
    "type": "text",
    "children": [
        "Hello ",
        {
            "type": "text",
            "style": "bold",
            "children": ["World"]
        }
    ]
}
```
{% endtab %}
{% endtabs %}

| Props                                        | Type                                              | Description                    |
| -------------------------------------------- | ------------------------------------------------- | ------------------------------ |
| `children`<mark style="color:red;">\*</mark> | `Array<string \| Text>`                           | Content of the text element.   |
| `style`<mark style="color:red;">\*</mark>    | `"bold" \| "italic" \| "strikethrough" \| "code"` | Style to format the text with. |

<mark style="color:red;">\*required</mark>



### `image`

The image component allows you to use images in your integration.

{% tabs %}
{% tab title="JSX" %}
```tsx
<image 
    source={{
        url: "https://example.com/image.png"
    }}
    aspectRatio={16 / 9}
/>
```
{% endtab %}
{% endtabs %}

| Props                                           | Type     | Description                        |
| ----------------------------------------------- | -------- | ---------------------------------- |
| `source`<mark style="color:red;">\*</mark>      | `object` | Content to load in the image.      |
| `source.url`<mark style="color:red;">\*</mark>  | `string` | URL of the image to load           |
| `aspectRatio`<mark style="color:red;">\*</mark> | `number` | Aspect ratio to use for the image. |

<mark style="color:red;">\*required</mark>



### `markdown`

Rich-text formatting of Markdown content.

{% tabs %}
{% tab title="JSX" %}
```tsx
<markdown content="Hello **world**" />
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "markdown",
    "content": "Hello **world**"
}
```
{% endtab %}
{% endtabs %}

| Props                                       | Type     | Description                     |
| ------------------------------------------- | -------- | ------------------------------- |
| `content`<mark style="color:red;">\*</mark> | `string` | Markdown text content to render |

<mark style="color:red;">\*required</mark>



### Interactive

### `button`

Interactive pressable button, triggering a component action when clicked.

{% tabs %}
{% tab title="JSX" %}
```tsx
<button label="Click me" onPress={{ type: 'something' }} />
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "button",
    "label": "Click me",
    "onPress": { "type": "something" }
}
```
{% endtab %}

{% tab title="Examples" %}
Basic button:

```
{
    "type": "button",
    "label": "Click me",
    "onPress": { "type": "something" }
}
```

With an icon:

```
{
    "type": "button",
    "label": "Click me",
    "icon": "maximize",
    "onPress": { "type": "something" }
}
```

With a tooltip:

```
{
    "type": "button",
    "label": "Click me",
    "tooltip": "More text here",
    "onPress": { "type": "something" }
}
```

With a confirm modal:

```
{
    "type": "button",
    "label": "Click me",
    "confirm": {
        "title": "Confirm the action",
        "text": "Help text here",
        "confirm": "Ok"
    },
    "onPress": { "type": "something" }
}
```
{% endtab %}
{% endtabs %}

| Props                                               | Type                                   | Description                                                                    |
| --------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------ |
| `label`<mark style="color:red;">\*</mark>           | `string`                               | Text displayed in the button                                                   |
| `onPress`<mark style="color:red;">\*</mark>         | `Action`                               | Action to trigger when the button is pressed                                   |
| `style`                                             | `'primary' \| 'secondary' \| 'danger'` | Visual style for the button                                                    |
| `tooltip`                                           | `string`                               | Text displayed in an hovering tooltip                                          |
| `icon`                                              | `Icon`                                 | Visual icon to display on the start of the button                              |
| `confirm`                                           | `object`                               | Modal object to display to ask the user to confirm the action before execution |
| `confirm.title`<mark style="color:red;">\*</mark>   | `string`                               | Title for the confirmation modal                                               |
| `confirm.text`<mark style="color:red;">\*</mark>    | `string`                               | Content of the confirmation modal                                              |
| `confirm.confirm`<mark style="color:red;">\*</mark> | `string`                               | Label for the confirmation button                                              |
| `confirm.style`<mark style="color:red;">\*</mark>   | `'primary' \| 'danger'`                | Style of the confirmation button                                               |

<mark style="color:red;">\*required</mark>



### `textinput`

An input component is used to capture text input from the end user. When an action is being dispatched to the integration, the value of the input is stored in the state value referenced by `id`.

{% tabs %}
{% tab title="JSX" %}
```tsx
<textinput
    id="name"
    label="Name"
    initialValue="John Doe"
    placeholder="Enter a name"
    />
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "textinput",
    "state": "name",
    "label": "Name",
    "initialValue": "John Doe",
    "placeholder": "Enter a name"
}
```
{% endtab %}

{% tab title="Examples" %}
Basic textinput:

```
{
    "type": "textinput",
    "state": "name",
    "label": "Name",
    "initialValue": "John Doe",
    "placeholder": "Enter a name"
}
```
{% endtab %}
{% endtabs %}

| Props                                     | Type     | Description                                                                                          |
| ----------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `state`<mark style="color:red;">\*</mark> | `string` | State binding. The value of the input will be stored as a property in the state named after this ID. |
| `initialValue`                            | `string` | Initial value of the input.                                                                          |
| `label`                                   | `string` | Label to display next to the input.                                                                  |
| `placeholder`                             | `string` | Text that appears in the form control when it has no value set                                       |

<mark style="color:red;">\*required</mark>



### `codeblock`

Multi-lines code blocks with syntax highlighting.

{% tabs %}
{% tab title="JSX" %}
```tsx
<codeblock content="const variable = 10" syntax="javascript" />
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "codeblock",
    "content": "const variable = 10",
    "syntax": "javascript"
}
```
{% endtab %}
{% endtabs %}

| Props                                       | Type                | Description                                                                                                                                                                                             |
| ------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content`<mark style="color:red;">\*</mark> | `string`            | Text content for the codeblock                                                                                                                                                                          |
| `syntax`                                    | `string`            | Syntax to use for highlighting                                                                                                                                                                          |
| `lineNumbers`                               | `boolean \| number` | Control the display of the line numbers                                                                                                                                                                 |
| `buttons`                                   | `Array<Button>`     | Buttons to render as an overlay in top-right corner                                                                                                                                                     |
| `state`                                     | `string`            | Editable state binding. The value of the input will be stored as a property in the state named after this ID. Passing this property automatically makes the code-block editable.                        |
| `onContentChange`                           | `Action`            | Action dispatched when the user has edited the content of this code block. It only applies if a `state` is passed. Usually the action is dispatched when the user is no longer focusing the code-block. |

<mark style="color:red;">\*required</mark>



### `webframe`

Element to render an external URL. The frame can receive update when states are updated by defining dependencies with `data` (see [interactivity](interactivity.md) for more details).

{% tabs %}
{% tab title="JSX" %}
```tsx
<webframe
    source={{ url: 'https://www.gitbook.com' }}
    aspectRatio={16 / 9}
/>
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "webframe",
    "source": {
        "url": "https://www.gitbook.com"
    },
    "aspectRatio": 1.7
}
```
{% endtab %}
{% endtabs %}

| Props                                           | Type                                       | Description                                                                                        |
| ----------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `source`<mark style="color:red;">\*</mark>      | `object`                                   | Content to load in the frame                                                                       |
| `source.url`<mark style="color:red;">\*</mark>  | `string`                                   |  URL of the content to load                                                                        |
| `aspectRatio`<mark style="color:red;">\*</mark> | `number`                                   | Aspect-ratio (width / height) for the block                                                        |
| `buttons`                                       | `Array<Button>`                            | Buttons to render as an overlay in top-right corner                                                |
| `data`                                          | `Record<string, string \| DynamicBinding>` | States this webframe is depend on. Each state update will cause the webframe to receive a message. |

<mark style="color:red;">\*required</mark>



### `select`

Select item&#x20;

{% tabs %}
{% tab title="JSX" %}
```tsx
<select state>
...
</select>
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "select",
}
```
{% endtab %}
{% endtabs %}

| Props                                     | Type                   | Description                                                                                          |
| ----------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `state`<mark style="color:red;">\*</mark> | `string`               | State binding. The value of the input will be stored as a property in the state named after this ID. |
| `initialValue`                            | `string` \| `string[]` | The initial value for the select component                                                           |
| `placeholder`                             | `string`               | Placeholder value for the select component                                                           |
| `multiple`                                | `boolean`              | Should the select accept the selection of multiple options. If true, the state will be an array.     |
| `options`                                 | `Array<object>`        | Options for the select component                                                                     |
| `options.id`                              | `string`               | Unique ID for the option                                                                             |
| `options.label`                           | `string`               | Label for the option                                                                                 |
| `options.url`                             | `string`               | URL for the option if using an external link                                                         |

<mark style="color:red;">\*required</mark>



### `switch`

A switch component to toggle between on and off.

{% tabs %}
{% tab title="JSX" %}
```tsx
<switch />
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "switch",
}
```
{% endtab %}
{% endtabs %}

| Props                                               | Type                    | Description                                                                                          |
| --------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------- |
| `state`<mark style="color:red;">\*</mark>           | `string`                | State binding. The value of the input will be stored as a property in the state named after this ID. |
| `initialValue`                                      | `boolean`               | Value to initialize the switch with.                                                                 |
| `confirm`                                           | `object`                | Modal object to display to ask the user to confirm the action before execution                       |
| `confirm.title`<mark style="color:red;">\*</mark>   | `string`                | Title for the confirmation button                                                                    |
| `confirm.text`<mark style="color:red;">\*</mark>    | `string`                | Content for the confirmation button                                                                  |
| `confirm.confirm`<mark style="color:red;">\*</mark> | `string`                | Label for the confirmation button                                                                    |
| `confirm.style`<mark style="color:red;">\*</mark>   | `'primary' \| 'danger'` | Style for the confirmation button                                                                    |

<mark style="color:red;">\*required</mark>



### `checkbox`

A checkbox component to toggle between checked and unchecked.

{% tabs %}
{% tab title="JSX" %}
```tsx
<checkbox />
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "checkbox",
}
```
{% endtab %}
{% endtabs %}

| Props                                               | Type                    | Description                                                                                          |
| --------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------- |
| `state`<mark style="color:red;">\*</mark>           | `string`                | State binding. The value of the input will be stored as a property in the state named after this ID. |
| `value`                                             | `string \| number`      | Value to store in a state array when the checkbox is selected.                                       |
| `confirm`                                           | `object`                | Modal object to display to ask the user to confirm the action before execution                       |
| `confirm.title`<mark style="color:red;">\*</mark>   | `string`                | Title for the confirmation button                                                                    |
| `confirm.text`<mark style="color:red;">\*</mark>    | `string`                | Content for the confirmation button                                                                  |
| `confirm.confirm`<mark style="color:red;">\*</mark> | `string`                | Label for the confirmation button                                                                    |
| `confirm.style`<mark style="color:red;">\*</mark>   | `'primary' \| 'danger'` | Style for the confirmation button                                                                    |

<mark style="color:red;">\*required</mark>



### `radio`

A radio component.

{% tabs %}
{% tab title="JSX" %}
```tsx
<radio />
```
{% endtab %}

{% tab title="JSON" %}
```json
{
    "type": "radio",
}
```
{% endtab %}
{% endtabs %}

| Props                                               | Type                    | Description                                                                                          |
| --------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------- |
| `state`<mark style="color:red;">\*</mark>           | `string`                | State binding. The value of the input will be stored as a property in the state named after this ID. |
| `value`                                             | `string \| number`      | Value to store in a state array when the checkbox is selected.                                       |
| `confirm`                                           | `object`                | Modal object to display to ask the user to confirm the action before execution                       |
| `confirm.title`<mark style="color:red;">\*</mark>   | `string`                | Title for the confirmation button                                                                    |
| `confirm.text`<mark style="color:red;">\*</mark>    | `string`                | Content for the confirmation button                                                                  |
| `confirm.confirm`<mark style="color:red;">\*</mark> | `string`                | Label for the confirmation button                                                                    |
| `confirm.style`<mark style="color:red;">\*</mark>   | `'primary' \| 'danger'` | Style for the confirmation button                                                                    |

<mark style="color:red;">\*required</mark>



