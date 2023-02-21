---
description: Tutorial to write a complete Slack integration from scratch.
---

# Slack

{% hint style="warning" %}
The GitBook Integration Platform is currently in **alpha**. It's not opened to developers just yet.
{% endhint %}

This guide will show you how to build an integration in GitBook that can authenticate the user with OAuth and handle events from GitBook to trigger actions on the external service (Slack).

For a complete code source reference, you can check out the official Slack integration's code: [https://github.com/GitbookIO/integrations/tree/main/integrations/slack](https://github.com/GitbookIO/integrations/tree/main/integrations/slack).

## Step 1: Create the integration

After following the [Quickstart](../../quickstart.md) guide to install and configure the GitBook CLI, you can create a new integration:

```
gitbook new ./my-slack
```

The CLI will prompt you to enter a title and to select scopes, choose the scopes `space:content` to ensure the integration can listen to the `space:content:updated` event.

## Step 2: Authenticate the user

Now that our integration can be edited locally, it's time to implement a flow to let the user authenticate themselves.

To do so, we are going to make 2 changes:

* Create a configuration in our `gitbook-manifest.yaml` file to indicate how the Slack credentials should be stored.
* Implement an OAuth HTTP flow

Edit the `gitbook-manifest.yaml` file to define the following configuration:

```yaml
...
configurations:
  account:
    properties:
      oauth_credentials:
        type: button
        title: Connection
        description: Authorization between Slack and GitBook.
        button_text: Authorize
        callback_url: /oauth
```

## Step 3: Listen to events

## Step 4: Make API calls to Slack
