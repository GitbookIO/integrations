# Creating a custom unfurl action

Link unfurling refers to the automatic previewing of website links shared in online platforms—Like chat applications, social media platforms, or messaging services.&#x20;

When you paste or share a link in a supported platform, the platform will automatically retrieve information from the linked web page and display a preview of that content.

When making an integration in GitBook, you're able to tap into this action, and display or embed content-rich blocks and previews. &#x20;

### Unfurling in GitBook already works

Before you dive in and create an integration for your platform, embedding your service might already be supported in GitBook.&#x20;

Underneath the hood, GitBook uses the service [iFramely](https://iframely.com/domains) to unpack and unfurl links pasted in the editor.&#x20;

If the iFramely service doesn't support the unfurling your link out of the box, it defaults to displaying the link as text instead.

If the link you're trying to unfurl doesn't work out of the box, you'll need to create an integration to handle the unfurling of your link.

### Create an integration

Creating an integration in GitBook allows you to add extra functionality to the way you're working. You can connect tools, build workflows, and further customize GitBook pages you create.

To build your first integration, head to our [Quickstart](../getting-started/setup-guide.md)!

After you have the boilerplate set up, we can take a look at an example code block for unfurling a link.

#### Example

```tsx
import {
    createIntegration,
    createComponent,
} from '@gitbook/runtime';

const UnfurlExample = createComponent<{
    url?: string;
}>({
    componentId: 'unfurl-example',

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                // The pasted URL
                const { url } = action;

                return {
                    props: {
                        url,
                    },
                };
            }
        }

        return element;
    },

    async render(element, context) {
        const { url } = element.props;

        return (
            <block>
                <webframe
                    source={{
                        url: url
                    }}
                />
            </block>
        );
    },
});

export default createIntegration({
    components: [UnfurlExample],
});
```

### Configure the block to unfurl urls

GitBook needs to know what integration can handle what specific url. To do so, integration blocks should be configured to list url patterns that can be unfurled:

<pre class="language-yaml"><code class="lang-yaml">blocks:
    - id: unfurl-example
      title: Unfurl Block
<strong>      urlUnfurl:
</strong>        - https://example.com
</code></pre>

### How it works

Let's have a look at the workflow for a user when they use the unfurl example above. After the integration is installed, the flow is as follows:

1. User finds and launches your integration
2. A modal appears and prompts to paste a link
3. After pasting a link, the `@link.unfurl` action runs, and returns props to the component
4. The component is rendered with the props we passed to it in step 3 (In our case, we render a [`webframe`](https://developer.gitbook.com/integrations/contentkit/reference/reference#webframe))

Because we're tapping into the `@link.unfurl` action before the component is rendered, we can add additional logic to get more information about the link before rendering it on the page. Depending on your intended use-case, you might want to obtain information from the url such as an `id`, [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams), or something else.

In the example above, the `render` method is rendering the pasted link in a `webframe`, creating an embedded link on the page.

To power your integration even more, you can also use GitBook utilities, like [dynamically binding](https://developer.gitbook.com/integrations/contentkit/interactivity#dynamic-binding) your webframe to other components, or posting messages to the GitBook page as a whole.

Additionally, in the render method you can control what to display—Like when data isn't found or a link might be private.
