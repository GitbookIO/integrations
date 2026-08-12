---
description: Write editor-managed content to a custom block property.
---

# Save editable block content

This guide builds a block with editable text and a button. The button saves the current text to the block properties.

### Before you start

You need a local integration project. Follow the [integration quickstart](../quickstart.md) before continuing.

### Add the component

In your integration entry file, create and register the component:

```typescript
import { createComponent, createIntegration } from '@gitbook/runtime';

const editableContent = createComponent({
  componentId: 'editable-content',
  render: async (element) => (
    <block>
      <textinput
        state="content"
        initialValue={element.props.content}
        label="Content"
      />
      <button
        label="Save content"
        onPress={{
          action: '@editor.node.updateProps',
          props: {
            content: element.dynamicState('content')
          }
        }}
      />
    </block>
  )
});

export default createIntegration({
  components: [editableContent]
});
```

The input keeps its working value in component state. `@editor.node.updateProps` stores that value in the editor node properties.

### Add the block to your manifest

In `gitbook-manifest.yaml`, add the block to the `blocks` list:

```yaml
title: My integration
blocks:
  - id: editable-content
    title: Editable content
```

The manifest block ID must match `componentId`.

### Test the block

1. Start your integration with the development command.
2. Insert **Editable content** from the inline palette.
3. Enter text and select **Save content**.

The block saves the input value as its `content` property.

### Next steps

Use the [text input](../development/contentkit/reference.md#text-input) and [button](../development/contentkit/reference.md#button) references to build richer editor interactions.
