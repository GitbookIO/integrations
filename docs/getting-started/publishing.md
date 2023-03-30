---
description: Learn how to Publish your apps and integrations publicly and privately
---

# Publishing

When you're ready to publish your integration, you're able to publish it for use within GitBook.

## Publishing to a space

To publish your integration, you will need to use the [GitBook CLI](broken-reference). By running the `publish` command, it will publish your integration to GitBook using the options defined in your `.gitbook-manifest.yaml` file.&#x20;

It's required to have a `name`, `title`, `description`,`scopes`, and `organization` in your `gitbook-manifest.yaml` file to publish an integration.

See the [Configurations section](../integrations/configurations.md) to learn more about the `.gitbook-manifest.yaml` file.

#### `name`

A unique name for your integration. (e.g. slack)

**`title`**

The title of your integration. (e.g. Slack)

**`description`**

The description for your integration.

**`organization`**

The [`organizationId`](concepts.md) or [subdomain](https://docs.gitbook.com/publishing/custom-domain/choose) of the organization that owns the integration you're publishing.

**`visibility`**

The visibility of your integration. By default it is set to "private". It is not currently possible to publish your integration publicly (see [Submitting to GitBook's Integration Marketplace](publishing.md#submitting-to-gitbooks-integration-marketplace)).

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

After successfully publishing your integration, you will be able to find and install your integration via the link returned in your console.

## Submitting to GitBook's Integration Marketplace

Right now, you're only able to publish your integration privately, for you to develop and test. We are accepting submissions for integrations to be listed publicly and within our [Integration Marketplace](https://www.gitbook.com/integrations).

If you've developed an integration and would like to submit it to our Marketplace, please reach out to us at [support@gitbook.com](mailto:support@gitbook.com).

