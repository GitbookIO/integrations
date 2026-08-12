---
description: Show a modal when a reader selects a custom block button.
---

# Open a modal from a button

This guide builds a block with a button that opens a modal. The modal closes when the reader selects **Close**.

### Before you start

You need a local integration project. Follow the [integration quickstart](../quickstart.md) before continuing.

### Add the component

In your integration entry file, create and register the component:

```typescript
import { createComponent, createIntegration } from '@gitbook/runtime';

const modalTrigger = createComponent({
  componentId: 'modal-example',
  render: async () => (
    <block>
      <button
        label="Open modal"
        onPress={{
          action: '@ui.modal.open',
          componentId: 'modal-content',
          props: {
            message: 'Hello world'
          }
        }}
      />
    </block>
  )
});

const modalContent = createComponent({
  componentId: 'modal-content',
  render: async () => (
    <modal title="Hello world">
      <text>Modal content</text>
      <button
        label="Close"
        onPress={{
          action: '@ui.modal.close',
          returnValue: {}
        }}
      />
    </modal>
  )
});

export default createIntegration({
  components: [modalTrigger, modalContent]
});
```

`@ui.modal.open` renders the component identified by `componentId`. `@ui.modal.close` closes the modal. The close action can return data through `returnValue`.

### Add the block to your manifest

In `gitbook-manifest.yaml`, add the block to the `blocks` list:

```yaml
title: My integration
blocks:
  - id: modal-example
    title: Modal example
```

The manifest block ID must match `componentId`.

### Test the block

1. Start your integration with the development command.
2. Insert **Modal example** from the inline palette.
3. Select **Open modal**, then select **Close**.

The modal opens and closes without leaving the page.

### Next steps

Use the [modal](../development/contentkit/reference.md#modal) and [button](../development/contentkit/reference.md#button) references to customize the interface.
