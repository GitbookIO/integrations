---
description: Render a custom integration block from Markdown synced with Git Sync
---

# Reference your component in markown

This guide maps a fenced code block to your custom component. After Git Sync imports the Markdown file, GitBook renders the component in the page.

### Before you begin

Before you start, make sure that:

* Your integration defines a custom block in `gitbook-manifest.yaml`.
* Your repository syncs with Git Sync.

### Map the code block

In `gitbook-manifest.yaml`, add a `markdown` mapping to the block:

```yaml
blocks:
  - id: block-name
    title: My custom block
    markdown:
      codeblock: blocksyntax
      body: content
```

The `codeblock` value identifies the Markdown fence. The `body` value identifies the component property that receives the fence content.

### Add the component to Markdown

In a Markdown file that Git Sync imports, add a fenced code block:

````markdown
```blocksyntax
something
```
````

GitBook creates your custom block with `content` set to `something`.

### Pass additional properties

Add properties after the fence name when your component needs more values:

````markdown
```blocksyntax propA="A"
something
```
````

GitBook sets `content` to `something` and `propA` to `A`.

### Sync and verify

1. Commit and push the manifest and Markdown changes.
2. Wait for Git Sync to import the commit.
3. Open the synced page in GitBook.

GitBook renders the fenced block as your custom component.

For custom block configuration, see [Configure your integration](../configurations.md#blocks). For component rendering, see the [Component reference](../development/contentkit/reference.md).
