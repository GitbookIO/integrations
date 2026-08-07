---
description: Pass component state to content running in a webframe.
---

# Send data to a webframe

This guide builds a block that sends text input to a webframe. The webframe displays the latest text value.

### Before you start

You need a local integration project and a page that your webframe can load. Follow the [integration quickstart](../quickstart.md) before continuing.

### Add the component

In your integration entry file, create and register the component:

```typescript
import { createComponent, createIntegration } from '@gitbook/runtime';

const webframeData = createComponent({
  componentId: 'webframe-data',
  render: async (element) => (
    <block>
      <textinput
        state="content"
        label="Message"
        placeholder="Enter a message"
      />
      <webframe
        source={{ url: '/iframe.html' }}
        data={{
          content: element.dynamicState('content')
        }}
      />
    </block>
  )
});

export default createIntegration({
  components: [webframeData]
});
```

Replace `/iframe.html` with the URL served by your app. `dynamicState` sends updated input values to the webframe.

### Receive the data

In the page loaded by the webframe, listen for messages from GitBook:

```javascript
window.addEventListener('message', (event) => {
  const content = event.data.state.content;

  document.querySelector('#message').textContent = content ?? '';
});
```

Add an element with the `message` ID to the page. The handler updates that element when GitBook sends new state.

### Add the block to your manifest

In `gitbook-manifest.yaml`, add the block to the `blocks` list:

```yaml
title: My integration
blocks:
  - id: webframe-data
    title: Webframe data
```

The manifest block ID must match `componentId`.

### Test the block

1. Start your integration with the development command.
2. Insert **Webframe data** from the inline palette.
3. Enter text in the block.

The webframe receives the updated value in `event.data.state.content`.

### Next steps

Use the [webframe reference](../development/contentkit/reference.md#webframe) to access page context, visitor claims, and navigation actions.
