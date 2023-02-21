# Setup Guide

Before you can use the GitBook Integration Platform, you'll need to make sure you have your developer account set up.

### Personal Access Token

In order to use the GitBook Integrations Platform, you'll need to first create a personal access token in your [developer settings](https://app.gitbook.com/account/developer).

This token represents your user in GitBook, and allows you to make API calls, create integrations, and publish them to any GitBook spaces you're a part of to test them.

{% hint style="info" %}
As always with access tokens, this token is specific to your user and should not be shared for use outside of your personal account.
{% endhint %}

Once you have your personal access token, you'll want to understand the differences between the pieces of the GitBook Integrations Platform in order to start developing your first app.

## GitBook API

The GitBook API can be used from outside the GitBook platform, and can be accessed via it's RESTful endpoints.&#x20;

Once you have your personal access token, you're already able to start making your first API call.

#### Make your first API call

{% content-ref url="../api/overview.md" %}
[overview.md](../api/overview.md)
{% endcontent-ref %}

## Integrations & Custom Blocks

Building Integrations and Custom Blocks requires use of the **GitBook CLI** in order to bootstrap your project and publish it to your GitBook space for testing and development purposes.&#x20;

Once you have your personal access token, head to our Integrations & Custom Blocks overview to start building your first app.

#### Build your first integration with the GitBook CLI

{% content-ref url="../integrations/" %}
[integrations](../integrations/)
{% endcontent-ref %}

## Visitor Authentication

Visitor Authentication requires you to set up a custom server that signs and serves a verified JWT token back to your users, which in turn allows your users to access your documentation.

#### Set up Visitor Authentication

{% content-ref url="broken-reference" %}
[Broken link](broken-reference)
{% endcontent-ref %}
