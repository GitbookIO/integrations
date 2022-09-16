# ContentKit reference

Our reference for the ContentKit covers all the objects you will receive and respond with, alongside all the components you can use in order to render the UI for your integrations.

If you want to learn more about the ContentKit itself, alongside the different types of requests we make in order to make these work, please take a look at our [introduction](README.md).

## Components

### `block`

### `button`

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

### `box`

### `stack`

### `spacer`

### `divider`

### `text`

### `codeblock`

### `markdown`

### `webframe`

