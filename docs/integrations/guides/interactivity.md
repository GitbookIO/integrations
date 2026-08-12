---
description: Build a block where a button updates displayed text.
---

# Update text with a button

This guide builds a custom block with a button. Selecting the button updates text in the block.

### Before you start

You need a local integration project. Follow the [integration quickstart](../quickstart.md) before continuing.

### Add the component

In your integration entry file, create and register the component:

```tsx
import { createComponent, createIntegration } from '@gitbook/runtime';

const textUpdater = createComponent({
    componentId: 'text-updater',
    initialState: () => ({
        message: 'Select the button to update this text.'
    }),
    async action(element, action) {
        if (action.action !== 'update-message') {
            return {};
        }

        return {
            state: {
                message: 'The button updated this text.'
            }
        };
    },
    async render(element) {
        return (
            <block>
                <text>{element.state.message}</text>
                <button
                    label="Update text"
                    onPress={{
                        action: 'update-message'
                    }}
                />
            </block>
        );
    }
});

export default createIntegration({
    components: [textUpdater]
});
```

The button dispatches the `update-message` action. The action handler returns the new component state.

### Add the block to your manifest

In `gitbook-manifest.yaml`, add the block to the `blocks` list:

```yaml
title: My integration
blocks:
  - id: text-updater
    title: Text updater
```

The manifest block ID must match `componentId`.

### Test the block

1. Start your integration with the development command.
2. Insert **Text updater** from the inline palette.
3. Select **Update text**.

The text changes after the integration handles the action.

### Continue building

Choose a focused guide for the next interaction:

* [Create an interactive text input](create-an-interactive-text-input.md).
* [Send data to a webframe](send-data-to-a-webframe.md).
* [Open a modal from a button](open-a-modal-from-a-button.md).
* [Save editable block content](save-editable-block-content.md).

For component options and supported actions, see the [component reference](../development/contentkit/reference.md).
