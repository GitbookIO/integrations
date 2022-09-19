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
createComponent({
    componentId: 'demo',
    initialState: {
        content: ''
    },
    async render(element) {
        return (
            <block>
                <hstack>
                    <textinput state="content" />
                    <divider />
                    <webframe
                        source={{ uri: '/iframe.html' }}
                        data={{
                            content: element.dynamicState('content')
                        }}
                        />
                </hstack>
            </block>
        )
    }
})
```

In the `iframe.html`, you can handle incoming events by listening to the `message` event coming from the parent window:

```js
window.addEventListener("message", (event) => {
    if (event.data) {
        const content = event.data.state.content;
    }
});
```

## Webframes and actions

Webframes are powerful elements to integrate in GitBook external applications or complete UI. Passing data to the webframe can be done using the `data` prop.
But the webframe also needs to be able to coomunicate data back to the top component. It can be achieved using the `window.postMessage`:

```js
window.parent.postMessage({
    action: {
        type: 'doSomething',
    }
}, '*');
```

## Modals

## Opening urls
