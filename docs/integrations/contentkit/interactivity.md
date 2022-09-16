# Interactivity

ContentKit makes interacting with users intuitive and stylish.

## Buttons and actions

The most common interactive elements are buttons. Buttons can be use to trigger an asynchronous action.

```tsx
<button
    label="Click me"
    action={{
        type: 'hello',
        anotherProperty: 'something'
    }}
    />
```

When the user presses the button, the `action` is dispatched to the integration and can be handled in the `action` callback:

```tsx
const helloWorldBlock = createComponent({
    ...
    action: async (previous, action) => {
        switch (action.type) {
            case 'hello':
                return { newStateProperty: action.anotherProperty };
            default:
                return previous;
        }
    },
    ...
});
```

## Text and other inputs

Collecting user input can be done through through inputs. The most common input elements are `textinput`.
Inputs are tied to state and their value will be stored in the state.

For example, considering the following element:

```tsx
<textinput state="content" />
```

When a next action will be dispatched (ex: when pressing a button), the value of the input will be accessible as `state.content`.

## Dynamic binding

Interactions with actions are asynchronous, pressing a button will cause the integration's code to run to re-render the component. But in some cases, there is a need for syncronous binding between the elements to provide a top class user experience (ex: live preview when typing).

ContentKit provides a solution with dynamic binding, connecting multiple elements to a dynamic state.

For example, we can update a webframe by binding directly to a textinput:

```tsx
<block>
    <hstack>
        <textinput state="content" />
        <divider />
        <webframe source={{ uri: '/iframe.html' }} dependencies={['content']} />
    </hstack>
</block>
```

In the `iframe.html`, you can handle incoming events by listening to the `message` event coming from the parent window:

```js
window.addEventListener("message", (event) => {
    if (event.data) {
        const content = event.data.state.content;
    }
});
```