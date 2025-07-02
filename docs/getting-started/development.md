---
description: Develop and test integrations in GitBook.
icon: shapes
---

# Development

After bootstrapping your integration with the [GitBook CLI](../integrations/reference.md), you can continue using the CLI to develop and test your app.

{% stepper %}
{% step %}
### Publish your integration

Before you're able to develop your integration, you will first need to publish it. You can do this by running the following command in the root directory:

```
gitbook publish
```

By default (defined in the CLI-generated `gitbook-manifest.yaml`), your integration will be published privately, and owned by the organization specified in the manifest.

After publishing your integration, the CLI will give you a link to install your integration into the organization you’ve set.

You need to install your app into at least 1 space or organization in order to develop it locally. Make sure to note the `spaceId` of the space you're installing it into for step 2.
{% endstep %}

{% step %}
### Start your integration’s development server

While inside the root directory of your app, run:

```
gitbook dev <spaceId>
```

This will start a development server tied to the space specified in the command.

After running the command, the CLI will generate a `gitbook-dev.yaml` file that contains the `spaceId` needed to establish the connection while you continue to develop your app. You can change this at any time in by re-running `gitbook dev <spaceId>`.

{% hint style="info" %}
Running this command will start a development server for use by the integration only. **You do not need to navigate to the port the server is running on.** \
\
All integration traffic to the specified space will automatically be served from your local server instead of the published version.
{% endhint %}
{% endstep %}

{% step %}
### Develop your integration

It's recommended that you [disable browser caching](https://stackoverflow.com/a/7000899) for the most optimal experience when developing your app.

Any logs sent to the console or made through your integration's `RuntimeContext` will be surfaced in your browser's console.&#x20;

{% hint style="warning" %}
Any UI changes made to your integration will need a browser refresh in order to be visible.&#x20;
{% endhint %}
{% endstep %}
{% endstepper %}

### FAQ

<details>

<summary>Why don't I see any logs in my console?</summary>

Depending on where your console log is run in your integration, you may see it in your machine's console or your browser's console. Please check both to ensure your logs are working correctly.

</details>

<details>

<summary>I'm getting an error when visiting the URL listed in the console.</summary>

The URL provided in the console is used as a server for your integration. You do not need to visit this URL.&#x20;

Instead, visit the GitBook space you provided in the dev command when starting your development server (i.e. `app.gitbook.com/o/org_id/s/space_id`).

</details>





