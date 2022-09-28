# Working with Markdown

GitBook can synchronize user content with Git repositories with content being formatted as Markdown. Integration blocks can be configured to leverage custom formatting and parsing of markdown content.

## Default formatting and parsing

GitBook will automatically support formatting and parsing all integration blocks with Markdown. By default the Liquid syntax is used:

```markdown
{% raw %}
{% myintegration/block-name propA="A" %}
{% endraw %}
```

## As a code block

In some cases (ex: with our official Mermaid block), integrations might want to format custom blocks as code-blocks in Markdown.

In the `gitbook-manifest.yaml`, define the `markdown` property for the a block:

<pre class="language-yaml"><code class="lang-yaml">blocks:
    - id: block-name
      title: My custom block
<strong>      markdown:
</strong><strong>        codeblock: blocksyntax
</strong><strong>        body: content</strong></code></pre>

In this scenario, a block with the properties `{ "content": "something" }` will be formatted as:

````
```blocksyntax
something
```
````

In the scenario where the block also has other properties, those will be set on the codeblock. For example with a block having the properties `{ "content": "something", "propA": "A" }`

````
```blocksyntax propA="A"
something
```
````
