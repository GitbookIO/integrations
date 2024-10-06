# Content sources 

Integrations can act as sources for computing content from external sources. Use-cases include:

- Translation: auto-translate another content and keeping it updated
- Changelog
- Code documentation


## Flow

## Create a content source

First of all, content sources should be listed in the `gitbook-manifest.yaml` file, under `sources`:

```yaml
sources:
    - id: pirate
      title: Content as a Pirate
```

Then the content source can be implemented:

```ts
import { createContentSource } from '@gitbook/runtime';

const pirate = createContentSource({
    sourceId: 'pirate',
    getPages: () => {

    },
    getPageDocument: () => {

    }
});
```

## Refreshing content when source has changed

At the moment, an integration source can only depend on a GitBook space as a dependency. But we plan on implementing supporting for custom dependencies that can be refreshed.
