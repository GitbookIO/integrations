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

| Key              | Description                          |
| ---------------- | ------------------------------------ |
| `eventId`        | The id of the event                  |
| `type`           | The type of event fired              |
| `installationId` | The id of the installation event     |
| `status`         | The status of the installation event |

### `space_installation_setup`

Event received when integration has been installed or updated on a space.

| Key              | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `eventId`        | The id of the event                                   |
| `type`           | The type of event fired                               |
| `installationId` | The id of the installation event                      |
| `spaceId`        | The id of the space the installation event occured in |
| `status`         | The status of the installation event                  |
|                  |                                                       |

### `space_view`

Event received when a page has been visited.

| Key        | Description                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| `eventId`  | The id of the event                                                                                  |
| `type`     | The type of event fired                                                                              |
| `pageId`   |                                                                                                      |
| `visitor`  | <p><code>anonymousId</code><br><code>cookies</code><br><code>userAgent</code><br><code>ip</code></p> |
| `url`      |                                                                                                      |
| `referrer` |                                                                                                      |

### `ui_render`

Event generated when rendering a UI

| Key           | Description             |
| ------------- | ----------------------- |
| `eventId`     | The id of the event     |
| `type`        | The type of event fired |
| `auth`        | `userId`                |
| `componentId` |                         |
| `props`       |                         |
| `state`       |                         |
| `context`     |                         |
| `action`      |                         |

### `space_content_updated`

Event when the primary content of a space has been updated.

| Key       | Description             |
| --------- | ----------------------- |
| `eventId` | The id of the event     |
| `type`    | The type of event fired |
|           |                         |
|           |                         |

### `space_visibility_updated`

Event when the visibility of the space has been changed.

| Key                  | Description             |
| -------------------- | ----------------------- |
| `eventId`            | The id of the event     |
| `type`               | The type of event fired |
| `visibility`         |                         |
| `previousVisibility` |                         |

### `space_gitsync_completed`

Event when a GitSync operation has been completed.

| Key          | Description             |
| ------------ | ----------------------- |
| `eventId`    | The id of the event     |
| `type`       | The type of event fired |
| `state`      |                         |
| `revisionId` |                         |
| `commitId`   |                         |

### `space_gitsync_started`

Event when a GitSync operation has been started.

| Key          | Description             |
| ------------ | ----------------------- |
| `eventId`    | The id of the event     |
| `type`       | The type of event fired |
| `revisionId` |                         |
| `commitId`   |                         |
