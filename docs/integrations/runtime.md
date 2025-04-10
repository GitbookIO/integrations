---
icon: puzzle-piece
---

# Integration runtime

GitBook Runtime is the platform that lets you build and run integrations within GitBook. Integrations can extend GitBook’s functionality by providing custom UI components, handling events, managing OAuth authentication, and communicating over HTTP. This guide explains how to build an integration, what each key element does, and how they interact.

The main building blocks are:

* **Integration Initialization** – Register your integration.
* **UI Components** – Create custom, interactive components.
* **OAuth Handling** – Manage authentication flows.
* **Environment Context** – Access runtime and installation details.
* **HTTP Communication** – Fetch external data using HTTP.
* **Actions & Rendering** – Define component behavior and display.
* **Event Handling** – Listen and respond to GitBook events.
* **URL Utilities** – Work with URLs and query strings.

### `createIntegration`

Integrations are created using the `createIntegration()` method. This method is the entrypoint for your integration and sets up its runtime context, including HTTP fetch methods, UI components, and event handlers.

```js
export default createIntegration({
  fetch: async (request, context) => {
    // Process an HTTP request.
    return new Response(JSON.stringify({ message: "Hello World" }), {
      headers: { "Content-Type": "application/json" }
    });
  },
  components: [
    // A named component created using createComponent().
    myComponent
  ],
  events: {
    space_view: async (event, context) => {
      console.log("Space viewed:", event);
    },
  },
});
```

`createIntegration()` accepts the following object parameters:

<table><thead><tr><th valign="top">Key</th><th valign="top">Type</th><th valign="top">Description</th></tr></thead><tbody><tr><td valign="top"><strong>fetch</strong></td><td valign="top">Async Function</td><td valign="top">A function to handle incoming HTTP requests or action dispatches.</td></tr><tr><td valign="top"><strong>components</strong></td><td valign="top">Array</td><td valign="top">A list of UI component definitions created using <code>createComponent()</code>.</td></tr><tr><td valign="top"><strong>events</strong></td><td valign="top">Object</td><td valign="top">An object mapping event names to their handler functions.</td></tr></tbody></table>

### `createComponent`

UI components let you build interactive elements that appear in GitBook’s quick insert menu (⌘ + /) or in the configuration screen of your integration. Use the `createComponent()` method to define a component’s identifier, initial state, actions, and rendering logic.

```js
const myComponent = createComponent({
  componentId: "unique-id",
  initialState: (props) => ({ message: "Click me" }),
  action: async (element, action, context) => {
    switch (action.action) {
      case "say":
        return { state: { message: "Hello World" } };
      default:
        return {};
    }
  },
  render: async (element, context) => {
    return (
      <block>
        <button label={element.state.message} onPress={{ action: "say" }} />
      </block>
    );
  },
});
```

`createComponent()` accepts the following object parameters:

<table><thead><tr><th valign="top">Key</th><th valign="top">Type</th><th valign="top">Description</th></tr></thead><tbody><tr><td valign="top"><strong>componentId</strong></td><td valign="top">string</td><td valign="top">Unique identifier for the component.</td></tr><tr><td valign="top"><strong>initialState</strong></td><td valign="top">Function (props) ⇒ object</td><td valign="top">Function that initializes the component state based on its props.</td></tr><tr><td valign="top"><strong>action</strong></td><td valign="top">Async Function</td><td valign="top">Callback that handles user interactions; receives <code>element</code>, <code>action</code>, and <code>context</code>.</td></tr><tr><td valign="top"><strong>render</strong></td><td valign="top">Async Function</td><td valign="top">Function that returns the component’s UI as ContentKit markup.</td></tr></tbody></table>

### `createOAuthHandler`

When your integration requires user authentication via OAuth, you use `createOAuthHandler()` to define the OAuth flow. This function sets up redirection, token exchange, and extraction of credentials.

```js
const oauthHandler = createOAuthHandler({
  redirectURL: `${environment.integration.urls.publicEndpoint}/oauth`,
  clientId: environment.secrets.CLIENT_ID,
  clientSecret: environment.secrets.CLIENT_SECRET,
  authorizeURL: "https://linear.app/oauth/authorize",
  accessTokenURL: "https://api.linear.app/oauth/token",
  extractCredentials: (response) => {
    if (!response.ok) {
      throw new Error(`Failed to exchange code for access token ${JSON.stringify(response)}`);
    }
    return {
      configuration: {
        oauth_credentials: { access_token: response.access_token },
      },
    };
  },
});
```

`createOAuthHandler()` accepts the following object parameters:

<table><thead><tr><th width="174.37933349609375">Parameter</th><th width="101.98699951171875">Type</th><th>Description</th><th>Example Value</th></tr></thead><tbody><tr><td><strong>clientId</strong>*</td><td>string</td><td>Your client application ID from the OAuth provider.</td><td><code>"my-client-id"</code></td></tr><tr><td><strong>clientSecret</strong>*</td><td>string</td><td>Your client secret from the OAuth provider.</td><td><code>"my-client-secret"</code></td></tr><tr><td><strong>authorizeURL</strong>*</td><td>string</td><td>The URL where users are redirected for authorization.</td><td><code>"https://oauth.example.com/authorize"</code></td></tr><tr><td><strong>accessTokenURL</strong>*</td><td>string</td><td>The URL used to exchange the authorization code for an access token.</td><td><code>"https://oauth.example.com/token"</code></td></tr><tr><td><strong>redirectURL</strong></td><td>string</td><td>(Optional) URL used for redirection if a static URL is needed.</td><td><code>"https://myapp.example.com/oauth"</code></td></tr><tr><td><strong>scopes</strong></td><td>string[]</td><td>An array of scopes to request during authentication.</td><td><code>["read", "write"]</code></td></tr><tr><td><strong>prompt</strong></td><td>string</td><td>(Optional) Configuration for prompting the user during authentication.</td><td><code>"consent"</code></td></tr><tr><td><strong>extractCredentials</strong></td><td>function</td><td>A function that processes the OAuth response and returns credentials in the expected format.</td><td><code>(response) => { … }</code></td></tr></tbody></table>

### Rendering components

The render function returns the UI for the component using ContentKit markup.

```js
render: async (element, context) => {
  return (
    <block>
      <button label={element.state.message} onPress={{ action: "say" }} />
    </block>
  );
},
```

### Environment context

GitBook provides an environment object that gives your integration details about the runtime context, such as API endpoints, integration configuration, installation details, and secrets.

```js
// Accessing environment values in your fetch or render method:
const { apiEndpoint, integration, secrets } = context.environment;
console.log("API endpoint:", apiEndpoint);
```

The `context.environment` object can include the following:

#### API information

| Key             | Type   | Description                                 |
| --------------- | ------ | ------------------------------------------- |
| **apiEndpoint** | string | URL of the HTTP API.                        |
| **apiTokens**   | object | Contains authentication tokens for the API. |

#### Integration information

| Key             | Type   | Description                           |
| --------------- | ------ | ------------------------------------- |
| **integration** | object | Details about the integration itself. |

#### Site installation (if applicable)

| Key               | Type   | Description                                                             |
| ----------------- | ------ | ----------------------------------------------------------------------- |
| **space**         | string | ID of the space where the integration is installed.                     |
| **status**        | object | Installation status; e.g., Active, Pending, Paused.                     |
| **configuration** | object | Custom configuration variables for the space.                           |
| **externalIds**   | any    | External identifiers.                                                   |
| **urls**          | object | Contains URLs associated with the installation (e.g., public endpoint). |

#### Organization installation (if applicable)

| Key                  | Type      | Description                                               |
| -------------------- | --------- | --------------------------------------------------------- |
| **id**               | string    | Installation ID.                                          |
| **space\_selection** | object    | Specifies whether all spaces or selected spaces are used. |
| **configuration**    | object    | Custom configuration for the organization.                |
| **urls**             | object    | Contains organization-related URLs.                       |
| **externalIds**      | string\[] | Array of external IDs assigned by the integration.        |
| **target**           | string    | Target of the integration installation.                   |

#### Runtime secrets

| Key         | Type   | Description                                                                                                         |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| **secrets** | object | Secrets stored on the integration for runtime use. Defined in the integration's [configuration](configurations.md). |

### Events

GitBook fires events when specific actions occur (like viewing a page or updating content). Your integration can listen to these events to update state, log information, or trigger other actions.

Depending on the event, your integration may need the correct [scope permissions](configurations.md#scopes).

Inside the `createIntegration()` call, you define event handlers:

```js
export default createIntegration({
  events: {
    space_view: async (event, context) => {
      console.log("Space viewed event:", event);
    },
  },
});
```

Here are the available events you can read:

| Event Name                 | Description                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| `installation_setup`       | Triggered when the integration is first installed globally.        |
| `space_installation_setup` | Triggered when the integration is installed into a specific space. |
| `space_view`               | Triggered when a user views a space.                               |
| `ui_render`                | Triggered when the integration's UI component is rendered.         |
| `space_content_updated`    | Triggered when content in the space is changed or updated.         |
| `space_visibility_updated` | Triggered when a space's visibility settings are changed.          |
| `space_gitsync_started`    | Triggered when a Git sync process begins for a space.              |
| `space_gitsync_completed`  | Triggered when a Git sync process completes for a space.           |

### Actions

Interactive components can respond to user **events** via **actions**. They are defined in your component when using `createComponent()`.

```js
action: async (element, action, context) => {
  // Process the action
  switch (action.action) {
    case "say":
      return { state: { message: "Hello World" } };
    default:
      return {};
  }
},
```

### HTTP communication

Integrations communicate with external services via HTTP using the Fetch API.

| Option      | Type   | Description                       | Example Value                            |
| ----------- | ------ | --------------------------------- | ---------------------------------------- |
| **method**  | string | HTTP method (GET, POST, etc.).    | `"POST"`                                 |
| **headers** | object | HTTP headers as key/value pairs.  | `{ "Content-Type": "application/json" }` |
| **body**    | string | Payload to send with the request. | `'{"message": "Hello World"}'`           |

#### Fetch Method Example

```js
fetch: async (request, context) => {
  const data = { message: "Hello World" };
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
```

**Request Example:**

```js
const request = new Request("https://example.com", {
  method: "POST",
  body: '{"message": "Hello World"}',
});
```

**Response Example:**

```js
const handleFetchEvent = async (request, context) => {
  return new Response(JSON.stringify({ message: "Hello World" }), {
    headers: { "Content-Type": "application/json" }
  });
};
```

Learn more from the [MDN Request docs](https://developer.mozilla.org/en-US/docs/Web/API/Request) and [MDN Response docs](https://developer.mozilla.org/en-US/docs/Web/API/Response).
