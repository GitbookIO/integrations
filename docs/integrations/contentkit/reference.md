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
| `children` | `Array<Block> | Array<Inline>` | (_Required_) Content to display in the block |
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

### `divider`

### `text`

### `codeblock`

### `markdown`

### `webframe`

