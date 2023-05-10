---
description: Learn how to Publish your apps and integrations publicly and privately
---

# Publishing

When you're ready to publish your integration, you're able to publish it for use within GitBook.

## Publishing to your organization

To publish your integration, you will need to use the [GitBook CLI](broken-reference). By running the `publish` command, it will publish your integration to GitBook using the options defined in your `gitbook-manifest.yaml` file.&#x20;

It's required to have a `name`, `title`, `description`, `scopes`, and `organization` in your `gitbook-manifest.yaml` file to publish an integration.

By default, it will publish your integration to the organization specified in your integration's `gitbook-manifest.yaml` file. Keep in mind, that only users within this organization will be able to install it.

See the [Configurations section](../integrations/configurations.md) to learn more about the `gitbook-manifest.yaml` file.

#### `name`

A unique name for your integration. (e.g. slack)

**`title`**

The title of your integration. (e.g. Slack)

**`description`**

The description for your integration.

**`organization`**

The [`organizationId`](concepts.md) or [subdomain](https://docs.gitbook.com/publishing/custom-domain/choose) of the organization that owns the integration you're publishing.

**`visibility`**

The visibility for your integration. Defaults to `private`. When set to `private`, only members of the organization that owns the integration are able to see or install the integration into a space.&#x20;

Set the visibility to `unlisted` in order to share your integration install link with anyone.

Setting the visibility to `public` is only available by GitBook staff, and setting it to `public` will allow your integration to be [listed on our marketplace](https://www.gitbook.com/integrations). See [Submitting to GitBook's Integration Marketplace](publishing.md#submitting-to-gitbooks-integration-marketplace) below for more info.

**`scopes`**

A list of scopes your integration allows. The following scopes are accepted:

```yaml
  - space:content:read
  - space:content:write
  - space:metadata:read
  - space:metadata:write
  - space:views:read
```

### Installing your integration

After successfully publishing your integration, you will be able to find and install your integration via the link returned in your console.&#x20;

Keep in mind, that only users within your organization will be able to find or install your integration in their spaces.

### Sharing your integration with others

If you're interested in sharing or testing your integration with users outside, you'll need to update the `visibility` key in your integration's `gitbook-manifest.yaml` file.&#x20;

Setting `visibility: unlisted` will allow your integration to be installed in organizations outside of the one that has published it. Make sure you republish your integration using `gitbook publish` after updating this key locally.

## Submitting to GitBook's Integration Marketplace

In order for your integration to be listed on our Marketplace, you will need to go through our submission process.&#x20;

See [submitting your app for review](../marketplace/submit-your-app-for-review.md) for more info.

