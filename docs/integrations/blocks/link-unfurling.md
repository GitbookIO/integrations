# Link unfurling

As users insert URLs into GitBook, we convert them into preview blocks, adding context and continuity to documents.

By default, GitBook will use the oembed spec to transform the url into a nice-looking embed. But for services with authentication, it can be limiting and not offer the best experience to the end user.

"Link unfurling" refers to the concept of converting a url input from the user into a custom integration block.

## Configure the block to unfurl urls

GitBook needs to know what integration can handle what specific url. To do so, integration blocks should be configured to list url patterns that can be unfurled:

<pre class="language-yaml"><code class="lang-yaml">blocks:
    - id: helloworld
      title: Hello world
<strong>      urlUnfurl:
</strong><strong>        - https://myapp.com/</strong></code></pre>

## Handle the `@link.unfurl` action

When a user pastes a url matching the defined pattern, a block will be inserted instead of the default embed and a rendering will be triggered at the integration level with a specific action: `@link.unfurl`:

```typescript
import { createComponent, createIntegration } from '@gitbook/runtime';

interface BlockProps {
 id: string;
}

const helloWorld = createComponent<BlockProps>({
  componentId: 'helloworld',
  async action(block, action) {
    if (action.action === '@link.unfurl') {
      return {
        props: {
          id: action.url.slice('https://myapp.com/'.length)
        }
      };
    }
  },
  
  async render(block) {
    const { id } = block.props;
  
    return (
      <block>
        <box>
          <text>Hello {id}!</text>
        </box>
      </block>
    );
  }
});

export default createIntegration({
  components: [helloWorld]
});
```

