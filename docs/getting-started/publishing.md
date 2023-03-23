---
description: Learn how to Publish your apps and integrations publicly and privately
---

# Publishing

{% hint style="danger" %}
This section is still currently a WIP as we continue to develop the GitBook Integrations Platform.
{% endhint %}

When you're ready to publish your integration, you're able to publish it for use within GitBook.

## Publishing to a space

To publish your integration, you will need to use the [GitBook CLI](broken-reference). By running the `publish` command, it will publish your integration to GitBook using the options defined in your `gitbook-manifest.yaml` file.&#x20;

It's required to have a `name`, `title`, `description`,`scopes`, and `organization` in your `gitbook-manifest.yaml` file to publish an integration.

#### `name`

A unique name for your integration. (e.g. slack)

**`title`**

The title of your integration. (e.g. Slack)

**`description`**

The description for your integration.

**`scopes`**

A list of scopes your integration allows. The following scopes are accepted:

```yaml
  - space:content:read
  - space:content:write
  - space:metadata:read
  - space:metadata:write
  - space:views:read
```

**`organization`**

The name of the **subdomain** for the organization you are publishing your integration to.



After successfully publishing your integration, you will be able to find your integration via the link returned in your console. \
\
Alternatively, you can visit your [organization's integration page](https://app.gitbook.com/account/integrations) to see your integration and any other available integrations to install to a space.&#x20;

## Submitting to GitBook's Integration Marketplace

WIP

