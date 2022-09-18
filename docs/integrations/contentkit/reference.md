# ContentKit reference

Our reference for the ContentKit covers all the objects you will receive and respond with, alongside all the components you can use in order to render the UI for your integrations.

If you want to learn more about the ContentKit itself, alongside the different types of requests we make in order to make these work, please take a look at our [introduction](README.md).

## Components

### `block`

Top level component for a custom block.

{% tabs %}
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
{% tab title="JSX" %}
```tsx
<block>
    ...
</block>
```
{% endtab %}
{% endtabs %}

| Props | Type | Description |
| ----- | ---- | ----------- |
| `children` | `Array<Block>` | (_Required_) Content to display in the block |

### `button`

Interactive pressable button, triggering a component action when clicked.

{% tabs %}
{% tab title="JSON" %}
```json
{
    "type": "button",
    "label": "Click me",
    "action": { "type": "something" }
}
```
{% endtab %}
{% tab title="JSX" %}
```tsx
<button label="Click me" action={{ type: 'something' }} />
```
{% endtab %}
{% tab title="Examples" %}
Basic button:

```contentkit
{
    "type": "button",
    "label": "Click me",
    "action": { "type": "something" }
}
```
{% endtab %}
{% endtabs %}

| Props | Type | Description |
| ----- | ---- | ----------- |
| `label` | `string` | (_Required_) Text displayed in the button |
| `action` | `Action` | (_Required_) Action to trigger when the button is pressed |
| `style` | `'primary' \| 'secondary' \| 'danger'` | Visual style for the button |
| `tooltip` | `string` | Text displayed in an hovering tooltip |
| `icon` | `Icon` | Visual icon to display on the start of the button |
| `confirm` | `object` | Modal to display to ask the user to confirm the action before execution |
| `confirm.title` | `string` | (_Required_) Title for the confirmation modal |
| `confirm.text` | `string` | (_Required_) Content of the confirmation modal |
| `confirm.confirm` | `string` | (_Required_) Label for the confirmation button |
| `confirm.style` | `'primary' \| 'danger'` | Content of the confirmation modal |

### `box`

{% tabs %}
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
{% tab title="JSX" %}
```tsx
<box style="card">
    ...
</box>
```
{% endtab %}
{% endtabs %}

| Props | Type | Description |
| ----- | ---- | ----------- |
| `children` | `Array<Block> \| Array<Inline>` | (_Required_) Content to display in the block |
| `style` | `'card' | 'default'` | Visual style for the box |


### `vstack`

Flex layout element to render a vertical stack of elements. Use [`spacer`](#spacer), [`divider`](#divider), and [`box`](#box) to complete the layout.

{% tabs %}
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
{% tab title="JSX" %}
```tsx
<vstack style="start">
    ...
</vstack>
```
{% endtab %}
{% endtabs %}

| Props | Type | Description |
| ----- | ---- | ----------- |
| `children` | `Array<Block>` | (_Required_) Content to display in the stack |
| `align` | `'start' \| 'center' \| 'end'` | Horizontal alignment of the elements in the stack |

### `hstack`

Flex layout element to render an horizontal stack of elements. Use [`spacer`](#spacer), [`divider`](#divider), and [`box`](#box) to complete the layout.

{% tabs %}
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
{% tab title="JSX" %}
```tsx
<hstack style="start">
    ...
</hstack>
```
{% endtab %}
{% endtabs %}

| Props | Type | Description |
| ----- | ---- | ----------- |
| `children` | `Array<Block>` | (_Required_) Content to display in the stack |
| `align` | `'start' \| 'center' \| 'end'` | Vertical alignment of the elements in the stack |


### `spacer`

A flexible space that expands along the major axis of its containing stack layout, or on both axes if not contained in a stack.

{% tabs %}
{% tab title="JSON" %}
```json
{
    "type": "spacer"
}
```
{% endtab %}
{% tab title="JSX" %}
```tsx
<spacer />
```
{% endtab %}
{% endtabs %}


### `divider`

A visual delimiter between 2 elements of a containing stack layout.

{% tabs %}
{% tab title="JSON" %}
```json
{
    "type": "divider"
}
```
{% endtab %}
{% tab title="JSX" %}
```tsx
<divider />
```
{% endtab %}
{% endtabs %}

### `text`

The text element is used for rendering blocks of text with formatting.

{% tabs %}
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
{% tab title="JSX" %}
```tsx
<text>
    Hello <text style="bold">World</text>
</text>
```
{% endtab %}
{% endtabs %}

| Props | Type | Description |
| ----- | ---- | ----------- |
| `children` | `Array<string \| Text>` | (_Required_) Content of the text element. |
| `style` | `"bold" \| "italic" \| "strikethrough" \| "code"` | (_Required_) Style to format the text with. |

### `codeblock`

Multi-lines code blocks with syntax highlighting.

{% tabs %}
{% tab title="JSON" %}
```json
{
    "type": "codeblock",
    "content": "const variable = 10",
    "syntax": "javascript"
}
```
{% endtab %}
{% tab title="JSX" %}
```tsx
<codeblock content="const variable = 10" syntax="javascript" />
```
{% endtab %}
{% endtabs %}

| Props | Type | Description |
| ----- | ---- | ----------- |
| `content` | `string` | (_Required_) Text content for the codeblock |
| `syntax` | `string` | Syntax to use for highlighting |
| `lineNumbers` | `boolean \| number` | Control the display of the line numbers |
| `buttons` | `Array<Button>` | Buttons to render as an overlay in top-right corner |

### `markdown`

Rich-text formatting of Markdown content.

{% tabs %}
{% tab title="JSON" %}
```json
{
    "type": "markdown",
    "content": "Hello **world**"
}
```
{% endtab %}
{% tab title="JSX" %}
```tsx
<markdown content="Hello **world**" />
```
{% endtab %}
{% endtabs %}

| Props | Type | Description |
| ----- | ---- | ----------- |
| `content` | `string` | (_Required_) Markdown text content to render |

### `webframe`

Element to render an external URL. The frame can receive update when states are updated by defining dependencies with `data` (see [interactivity](./interactivity.md) for more details).

{% tabs %}
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
{% tab title="JSX" %}
```tsx
<webframe
    source={{ url: 'https://www.gitbook.com' }}
    aspectRatio={16 / 9}
    />
```
{% endtab %}
{% endtabs %}

| Props | Type | Description |
| ----- | ---- | ----------- |
| `source` | `object` | (_Required_) Content to load in the frame |
| `source.url` | `string` | (_Required_) URL of the content to load |
| `aspectRatio` | `number` | (_Required_) Aspect-ratio (width / height) for the block |
| `buttons` | `Array<Button>` | Buttons to render as an overlay in top-right corner |
| `data` | `Record<string, string \| DynamicBinding>` | States this webframe is depend on. Each state update will cause the webframe to receive a message. |

### `textinput`

An input component is used to capture text input from the end user. 
When an action is being dispatched to the integration, the value of the input is stored in the state value referenced by `id`. 

{% tabs %}
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
{% endtabs %}

| Props | Type | Description |
| ----- | ---- | ----------- |
| `state` | `string` | (_Required_) State binding. The value of the input will be stored as a property in the state named after this ID. |
| `initialValue` | `string` | Initial value of the input. |
| `label` | `string` | Label to display next to the input. |
| `placeholder` | `string` | Text that appears in the form control when it has no value set |

## Actions

### `@ui.url.open`

### `@ui.modal.open`

### `@ui.modal.close`

### `@webframe.ready`

```js
{
    "action": "@webframe.ready"
}
```

Action to send as a message from a webframe to indicate that the webframe is ready to receive messages and updates.

### `@webframe.resize`

```js
{
    "action": "@webframe.resize",
    "aspectRatio": 1.7,
    "maxHeight": 400,
    "maxWidth": 300
}
```

Action to send as a message from a webframe to resize the container.