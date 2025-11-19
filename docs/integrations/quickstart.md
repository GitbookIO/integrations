---
description: >-
  In this guide you’ll learn how to get up and running with GitBook’s developer
  platform in minutes
icon: bolt
---

# Quickstart

GitBook’s developer platform allows you to build integrations that seamlessly connect GitBook to internal tools, third‑party services, custom workflows and more.

You can use the integration platform to:

* [**Automate repetitive tasks**](guides/ci.md)**:** Sync content, manage permissions, or trigger actions without leaving GitBook.
* [**Embed interactive components**](development/contentkit/)**:** Enhance documentation pages with custom built UI, buttons, and dynamic content.
* **Integrate data from other tools**: Pull in data from external sources and connect them with your GitBook workflow.
* **Securely connect systems:** Handle authentication via OAuth and manage access control programmatically.

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

The [GitBook CLI](reference/) requires Node v18 or later. It can be installed from NPM using:

```bash
npm install @gitbook/cli -g
```

### Authenticate with your account

Once you have the CLI installed, you can run the following command and authenticate yourself with your personal access token using the following command:

```bash
gitbook auth
```

### Bootstrap your integration

Bootstrap your first integration by running the following command:

```bash
gitbook new
```

The prompts will ask you for a `name`, `title`, `organization`, and `scopes` for your integration.

{% hint style="warning" %}
In order to publish your integration, your `.gitbook-manifest.yaml` must:

* Include a unique `name`
* Include an `organization` id that your authenticated user is a member of.
{% endhint %}

### Develop your integration locally

In order to [develop your integration](development/) on your local machine, you’ll first need to publish your integration. In the root of your integration, run:

```
gitbook publish
```

This will publish your integration to GitBook, and return a link with which you can install your integration. After installing your integration into your organization, space, or site, you can then run the development command to work on your integration locally.

Return to your integration on your local machine, and in the root of the integration, run the following development command:

```bash
gitbook dev
```

After running the development script, you’re ready to start building your integration. Any changes made in your local version of the integration will be sent to the space you have your integration installed in. You’ll also be able to see logs in your console where applicable.

### Install and use your integration

Once you’re ready to start using your integration in GitBook, you’ll need to install your integration into a space or site.&#x20;

You can find your integration’s install link returned in your terminal after publishing your integration with the `gitbook publish` command.
