---
description: Learn how to develop apps and integrations for GitBook
---

# Development

Developing an integration in GitBook may include using ContentKit and GitBook's Runtime APIs. If you're building an integration that uses GitBook's REST API, you'll already be able to see these updates in realtime.

### Local Development

After bootstrapping your app or integration with the [GitBook CLI](broken-reference), you're able to use a different command from the CLI to connect your app with a specific space in your GitBook instance for development purposes.

#### **Step 1: Publish your app**

Before you're able to develop your app, you will first need to publish your app to GitBook's integration platform.&#x20;

You can do this by running the following command in the root directory of your app:

```
gitbook publish
```

By default (defined in the CLI-generated `gitbook-manifest.yaml`, your integration will be published privately, and owned by the organization specified in the manifest.

After publishing your integration, the CLI will give you a link to install your integration into 1 or more spaces in your organization.&#x20;

You need to install your app into at least 1 space in order to continue developing it locally. Make sure to note the [`spaceId`](concepts.md) of the space you're installing it into for step 2.

#### Step 2: Connect your app to a space in GitBook&#x20;

While inside the root directory of your app, you can run:

```
gitbook dev <spaceId>
```

This will start a development server tied to the space specified in the command. You can find more information on Space ID's and where to find them in the [Concepts section](concepts.md).

{% hint style="info" %}
Running this command will start a development server for use by the integration only. You do not need to navigate to the port the server is running on. \
\
Instead, all integration traffic to the specified space will automatically be served from your local server.
{% endhint %}

Running this command will generate a `gitbook-dev.yaml` file that contains the `spaceId` needed to establish the connection while you continue to develop your app.

After successfully starting the development server, you can add your integration to a page in your development GitBook space.

#### Step 3: Testing your app during development

In a page within the space you connected your development server to, you should be able to insert your integration from the integrations panel, or from the quick insert menu (⌘ + /).&#x20;

It's recommended that you [disable browser caching](https://stackoverflow.com/a/7000899) for the most optimal experience when developing your app.

{% hint style="warning" %}
If you don't see your integration in this list, you may not have published it correctly, or are viewing an incorrect space for your integration.
{% endhint %}

Any logs sent to the console or made through your integration's `RuntimeContext` will be surfaced in your browser's console.&#x20;

{% hint style="warning" %}
Any UI changes made to your integration will need a browser refresh in order to be visible.
{% endhint %}

### Debugging

We've enabled developer logs in your browser's console, allowing you to debug your integration for any errors in your code.&#x20;



> We're actively aiming to make the development and debugging experience better, and if you have any suggestions or feedback, feel free to start the discussion with us in our [GitBook community](https://github.com/GitbookIO/community).
