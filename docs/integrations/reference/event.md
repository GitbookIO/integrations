# Event

Events in GitBook occur when specific actions occur in a GitBook Space or environment. Your integration can tap into these events, read information about them, and dispatch actions as they occur. &#x20;

They are declared within the `createIntegration` call, and should return async callback functions for the events you would like to listen to.

**Example:**

```typescript
export default createIntegration({
    events: {
        space_view: async (event, context) => {
            // Handle event when the space your integration is installed in is viewed
        },
    },
});
```

## Reference

The following events can be read on the `event` object passed into the arguments of the callback functions run when the event occurs.

### `installation_setup`

Event received when integration has been installed or updated.

<table><thead><tr><th width="295">Key</th><th>Description</th></tr></thead><tbody><tr><td><code>eventId</code></td><td>The id of the event</td></tr><tr><td><code>type</code></td><td>The type of event fired</td></tr><tr><td><code>installationId</code></td><td>The id of the installation event</td></tr><tr><td><code>status</code></td><td>The status of the installation event</td></tr></tbody></table>

### `space_installation_setup`

Event received when integration has been installed or updated on a space.

<table><thead><tr><th width="295">Key</th><th>Description</th></tr></thead><tbody><tr><td><code>eventId</code></td><td>The id of the event</td></tr><tr><td><code>type</code></td><td>The type of event fired</td></tr><tr><td><code>installationId</code></td><td>The id of the installation event</td></tr><tr><td><code>spaceId</code></td><td>The id of the space the installation event occured in</td></tr><tr><td><code>status</code></td><td>The status of the installation event</td></tr><tr><td></td><td></td></tr></tbody></table>

### `space_view`

Event received when a page has been visited.

<table><thead><tr><th width="295">Key</th><th>Description</th></tr></thead><tbody><tr><td><code>eventId</code></td><td>The id of the event</td></tr><tr><td><code>type</code></td><td>The type of event fired</td></tr><tr><td><code>pageId</code></td><td></td></tr><tr><td><code>visitor</code></td><td><code>anonymousId</code><br><code>cookies</code><br><code>userAgent</code><br><code>ip</code></td></tr><tr><td><code>url</code></td><td></td></tr><tr><td><code>referrer</code></td><td></td></tr></tbody></table>

### `ui_render`

Event generated when rendering a UI

<table><thead><tr><th width="295">Key</th><th>Description</th></tr></thead><tbody><tr><td><code>eventId</code></td><td>The id of the event</td></tr><tr><td><code>type</code></td><td>The type of event fired</td></tr><tr><td><code>auth</code></td><td><code>userId</code></td></tr><tr><td><code>componentId</code></td><td></td></tr><tr><td><code>props</code></td><td></td></tr><tr><td><code>state</code></td><td></td></tr><tr><td><code>context</code></td><td></td></tr><tr><td><code>action</code></td><td></td></tr></tbody></table>

### `space_content_updated`

Event when the primary content of a space has been updated.

<table><thead><tr><th width="295">Key</th><th>Description</th></tr></thead><tbody><tr><td><code>eventId</code></td><td>The id of the event</td></tr><tr><td><code>type</code></td><td>The type of event fired</td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr></tbody></table>

### `space_visibility_updated`

Event when the visibility of the space has been changed.

<table><thead><tr><th width="295">Key</th><th>Description</th></tr></thead><tbody><tr><td><code>eventId</code></td><td>The id of the event</td></tr><tr><td><code>type</code></td><td>The type of event fired</td></tr><tr><td><code>visibility</code></td><td></td></tr><tr><td><code>previousVisibility</code></td><td></td></tr></tbody></table>

### `space_gitsync_completed`

Event when a GitSync operation has been completed.

<table><thead><tr><th width="295">Key</th><th>Description</th></tr></thead><tbody><tr><td><code>eventId</code></td><td>The id of the event</td></tr><tr><td><code>type</code></td><td>The type of event fired</td></tr><tr><td><code>state</code></td><td></td></tr><tr><td><code>revisionId</code></td><td></td></tr><tr><td><code>commitId</code></td><td></td></tr></tbody></table>

### `space_gitsync_started`

Event when a GitSync operation has been started.

<table><thead><tr><th width="295">Key</th><th>Description</th></tr></thead><tbody><tr><td><code>eventId</code></td><td>The id of the event</td></tr><tr><td><code>type</code></td><td>The type of event fired</td></tr><tr><td><code>revisionId</code></td><td></td></tr><tr><td><code>commitId</code></td><td></td></tr></tbody></table>
