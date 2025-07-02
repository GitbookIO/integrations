---
description: Get up and running with the developer platform in minutes.
icon: bolt
---

# Quickstart

### Getting started

You’ll need a GitBook account to start using the developer platform. If you don’t already have an account, you can sign up for free [here](https://app.gitbook.com/join).

### Create a personal access token

After creating a GitBook account, you'll be able to create a personal access token in your [developer settings](https://app.gitbook.com/account/developer).

This token represents your user in GitBook, and allows you to make API calls, create integrations, and publish them to any GitBook spaces you're a part of to test them.

{% hint style="warning" %}
As always with access tokens, this token is specific to your user and should not be shared for use outside of your personal account.
{% endhint %}

Once you have your personal access token, you'll want to understand the differences between the pieces of the GitBook Integrations Platform in order to start developing your first app.

### Install the GitBook CLI

The GitBook Development CLI requires Node v18 or later. It can be installed from NPM using:

```bash
npm install @gitbook/cli -g
```

### Authenticate with your account

Once you have the CLI installed, you can run the following command and authenticate yourself with your personal access token using the following command:

```bash
gitbook auth
```

### Bootstrap your app

Bootstrap your first integration by running the following command:

```bash
gitbook new
```

The prompts will ask you for a `name`, `title`, `organization`, and `scopes` for your integration.&#x20;

{% hint style="warning" %}
In order to publish your integration, your `.gitbook-manifest.yaml` must:

* Include a unique `name`
* Include an `organization` id that your authenticated user is a member of.
{% endhint %}

### Develop your app locally

In order to develop your integration on your local machine, you’ll first need to publish your integration. In the root of your integration, run:

```
gitbook publish
```

This will publish your app to GitBook, and return a link with which you can install your integration. Install your integration into a space, and note the `spaceId` in the URL.

Return to your integration on your local machine, and in the root of the integration, run the following development command:

```bash
gitbook dev spaceId
```

{% hint style="info" %}
Example: If your integration is installed in a space [`https://app.gitbook.com/o/1234/s/5678/`](https://app.gitbook.com/s/yPzlUas0Q5RLUIZ0s3Cl/integrations/development-environment), your `spaceId` would be `5678`.
{% endhint %}

After running the development script, you’re ready to start building your integration! Any changes made in your local version of the integration will be sent to the space you have your integration installed in. You’ll also be able to see logs in your console where applicable.

Read more on development and publishing concepts:

<table data-view="cards"><thead><tr><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td>Development</td><td><a href="development.md">development.md</a></td></tr><tr><td>Publishing</td><td><a href="publishing.md">publishing.md</a></td></tr><tr><td>Marketplace</td><td><a href="broken-reference">Broken link</a></td></tr></tbody></table>
