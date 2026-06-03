---
description: Learn about using custom blocks in Markdown when using Git Sync
---

# Markdown

In some cases, you might want to format custom blocks as code-blocks in Markdown.

In your `gitbook-manifest.yaml`, define the `markdown` property for the a block:

<pre class="language-yaml"><code class="lang-yaml">blocks:
    - id: block-name
      title: My custom block
<strong>      markdown:
</strong>        codeblock: blocksyntax
<strong>        body: content
</strong></code></pre>

In this scenario, a block with the properties `{ "content": "something" }` will be formatted in your Markdown as:

````markdown
```blocksyntax
something
```
````

In the scenario where the block also has other properties, those will be set on the code-block. For example with a block having the properties `{ "content": "something", "propA": "A" }`

````markdown
```blocksyntax propA="A"
something
```
````

{% hint style="info" %}
The native Mermaid block uses this pattern. If your content still uses older Mermaid code-blocks from the previous integration, GitBook converts them automatically when you edit the page.
{% endhint %}
