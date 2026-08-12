---
description: Build a block that stores text and shows it after a button action.
---

# Create an interactive text input

This guide builds a block with a text input and a button. The button updates the displayed message with the input value.

### Before you start

You need a local integration project. Follow the [integration quickstart](../quickstart.md) before continuing.

### Add the component

In your integration entry file, create and register the component:

```typescript
import { createComponent, createIntegration } from '@gitbook/runtime';

const interactiveTextInput = createComponent({
  componentId: 'interactive-text-input',
  initialState: () => ({
    message: 'Enter a message, then select Update text.'
  }),
  action: async (element, action) => {
    if (action.action !== 'show-text') {
      return {};
    }

    return {
      state: {
        message: element.state.content ?? ''
      }
    };
  },
  render: async (element) => (
    <block>
      <textinput
        state="content"
        label="Message"
        placeholder="Enter a message"
      />
      <button
        label="Update text"
        onPress={{ action: 'show-text' }}
      />
      <text>{element.state.message}</text>
    </block>
  )
});

export default createIntegration({
  components: [interactiveTextInput]
});
```

The `state` value on `textinput` stores the input as `content`. The button dispatches the `show-text` action. The action handler returns the new `message` state.

### Add the block to your manifest

In `gitbook-manifest.yaml`, add the block to the `blocks` list:

```yaml
title: My integration
blocks:
  - id: interactive-text-input
    title: Interactive text input
```

The manifest block ID must match `componentId`.

### Test the block

1. Start your integration with the development command.
2. Insert **Interactive text input** from the inline palette.
3. Enter a message and select **Update text**.

The block displays the message you entered.

### Next steps

Use the [button](../development/contentkit/reference.md#button) and [text input](../development/contentkit/reference.md#text-input) references to add more interactions.
