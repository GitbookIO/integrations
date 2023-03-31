# Interactivity

ContentKit makes interacting with your components intuitive and powerful.

## Buttons and actions

The most common interactive elements are buttons. Buttons can be use to trigger an asynchronous action.

```tsx
<button
    label="Click me"
    onPress={{
        action: 'hello',
        anotherProperty: 'something'
    }}
    />
```

When the user presses the button, the `action` is dispatched to the integration and can be handled in the `action` callback:

```tsx
const helloWorldBlock = createComponent({
    ...
    action: async (previous, action) => {
        switch (action.action) {
            case 'hello':
                return { state: { newStateProperty: action.anotherProperty } };
            default:
        }
    },
    ...
});
```

## Text and other inputs

Collecting user input can be done through through inputs. The most common input elements are `textinput`. Inputs are tied to state and their value will be stored in the state.

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

Webframes are powerful elements to integrate in GitBook external applications or complete UI. Passing data to the webframe can be done using the `data` prop. But the webframe also needs to be able to coomunicate data back to the top component. It can be achieved using the `window.postMessage`:

```js
window.parent.postMessage({
    action: {
        type: 'doSomething',
    }
}, '*');
```

## Modals

Components can open overlay modals to show extra information or prompt the user. Opening a modal is done by dispatching the `@ui.modal.open` action:

```typescript
const block = createComponent({
    componentId: 'block',
    async render(element) {
        return (
            <block>
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
            </block>
        )
    }
});
```

Opening the modal will start rendering the component `custommodal` with the defined props:

```typescript
const custommodal = createComponent({
    componentId: 'custommodal',
    async render(element) {
        return (
            <modal title="Hello world">
                <button
                    label="Close the modal"
                    onPress={{
                        action: '@ui.modal.close',
                        returnValue: {}
                    }}
                    />
            </block>
        )
    }
});
```

When closing a modal, data can be returned to the parent component using `returnValue`. These data will be accessible in the parent component's action handler.

## Opening urls

A common pattern is to open a url as a webpage. A default action exists for this:

```typescript
<button
    onPress={{
        action: '@ui.url.open',
        url: 'https://www.gitbook.com'
    }}
    />
```
