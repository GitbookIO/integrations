---
description: Build an integration with GitBook’s developer platform in minutes
---

# Quickstart

GitBook’s developer platform allows you to build integrations that seamlessly connect GitBook to internal tools, third‑party services, custom workflows and more.

{% stepper %}
{% step %}
### Getting started

You’ll need a GitBook account to start using the developer platform. If you don’t already have an account, you can sign up for free [here](https://app.gitbook.com/join).
{% endstep %}

{% step %}
### Create a personal access token

After creating a GitBook account, you'll be able to create a personal access token in your [developer settings](https://app.gitbook.com/account/developer).

This token represents your user in GitBook, and allows you to make API calls, create integrations, and publish them to any GitBook spaces you're a part of to test them.

{% hint style="warning" %}
As always with access tokens, this token is specific to your user and should not be shared for use outside of your personal account.
{% endhint %}

Once you have your personal access token, you'll want to understand the differences between the pieces of the GitBook Integrations Platform in order to start developing your first app.
{% endstep %}

{% step %}
### Install the GitBook CLI

The [GitBook CLI](reference/) requires Node v18 or later. It can be installed from NPM using:

```bash
npm install @gitbook/cli -g
```

#### Authenticate with your account

Once you have the CLI installed, you can run the following command and authenticate yourself with your personal access token using the following command:

```bash
gitbook auth
```
{% endstep %}

{% step %}
### Create your integration

You can bootstrap your first integration by running the following command in your terminal:

```bash
gitbook integrations new
```

The prompts will ask you for a `name`, `title`, `organization`, and `scopes` for your integration.

{% hint style="warning" %}
In order to publish your integration, your integration must:

* Include a unique `name`
* Include an `organization` id that your authenticated user is a member of.
{% endhint %}

After bootstrapping your integration, you’re ready to open your integration in an IDE and start building.
{% endstep %}

{% step %}
### Develop your integration locally

In order to [develop your integration](development/) on your local machine, you’ll first need to publish your integration. In the root of your integration, run:

If you use an AI coding assistant, add GitBook’s [`build-integration`](https://github.com/GitbookIO/gitbook-skills/tree/main/skills/build-integration) skill. It gives your assistant integration-specific guidance.

1. In your integration repository’s root directory, run:

```bash
npx skills add GitBookIO/gitbook-skills
```

2. Start a new agent session after the installation completes.
3. Ask your assistant to read the `build-integration` skill before building your integration.

```bash
gitbook integrations publish
```

This will publish your integration to GitBook, and return a link with which you can install your integration. After installing your integration into your organization, space, or site, you can then run the development command to work on your integration locally.

Return to your integration on your local machine, and in the root of the integration, run the following development command:

```bash
gitbook integrations dev
```

After running the development script, you’re ready to start building your integration. Any changes made in your local version of the integration will be sent to the space you have your integration installed in. You’ll also be able to see logs in your console where applicable.
{% endstep %}

{% step %}
### Install and use your integration

Once you’re ready to start using your integration in GitBook, you’ll need to install your integration into a space or site.

You can find your integration’s install link returned in your terminal after publishing your integration with the `gitbook integrations publish` command.
{% endstep %}
{% endstepper %}

### Continue building your integration

Continue with one of these integration guides:

<table data-view="cards"><thead><tr><th></th><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><h4><i class="fa-puzzle-piece">:puzzle-piece:</i></h4></td><td><h4>Create interactive blocks</h4></td><td>Build a custom block with a button that updates its text.</td><td><a href="guides/interactivity.md">interactivity.md</a></td></tr><tr><td><h4><i class="fa-bell">:bell:</i></h4></td><td><h4>Receive webhook notifications</h4></td><td>Receive external events and handle them in your integration.</td><td><a href="guides/webhook.md">webhook.md</a></td></tr><tr><td><h4><i class="fa-globe">:globe:</i></h4></td><td><h4>Handle an HTTP request</h4></td><td>Return a JSON response from your integration’s public endpoint.</td><td><a href="guides/receiving-requests.md">receiving-requests.md</a></td></tr></tbody></table>

### Explore the integration platform

<table data-view="cards"><thead><tr><th></th><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th><th data-hidden data-type="content-ref"></th><th data-hidden data-type="content-ref"></th><th data-hidden data-type="content-ref"></th></tr></thead><tbody><tr><td><h4><i class="fa-sliders">:sliders:</i></h4></td><td><h4>Configure your integration</h4></td><td>Define your integration’s metadata, scopes, blocks, and settings.</td><td></td><td><a href="configurations.md">configurations.md</a></td><td><a href="development/">development</a></td><td><a href="development/runtime.md">runtime.md</a></td></tr><tr><td><h4><i class="fa-puzzle-piece">:puzzle-piece:</i></h4></td><td><h4>Build components</h4></td><td>Create custom blocks with ContentKit and add interactive behavior.</td><td><a href="development/">development</a></td><td><a href="development/contentkit/">contentkit</a></td><td><a href="development/contentkit/reference.md">reference.md</a></td><td><a href="guides/interactivity.md">interactivity.md</a></td></tr><tr><td><h4><i class="fa-rocket">:rocket:</i></h4></td><td><h4>Publish your integration</h4></td><td>Publish, install, and submit your integration for review.</td><td><a href="publishing.md">publishing.md</a></td><td><a href="publishing.md">publishing.md</a></td><td><a href="submit-your-app-for-review.md">submit-your-app-for-review.md</a></td><td><a href="https://app.gitbook.com/s/NkEGS7hzeqa35sMXQZ4X/integrations/install-an-integration">Install and manage integrations</a></td></tr></tbody></table>
