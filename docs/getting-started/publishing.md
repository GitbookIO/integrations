---
description: Publish your apps and integrations publicly or privately.
icon: up-from-line
---

# Publishing

When you're ready to publish your integration, you're able to publish it for use within GitBook.

### Publishing to your organization

Publishing your integration will publish it to GitBook using the options defined in your integration’s  `gitbook-manifest.yaml` file.&#x20;

In order to publish, it's required to have:

* `name`
* `title`
* `description`
* `visibility`
* `script`
* `scopes`
* and `organization`

### Installing your integration

After successfully publishing your integration, you will be able to find and install your integration via the link returned in your console.&#x20;

### Updating your integration

At any point you can update your integration by running `gitbook publish` in your integration’s directory.

### Sharing your integration with others

If you're interested in sharing or testing your integration with others, you'll need to update the `visibility` key in your integration's `gitbook-manifest.yaml` file.&#x20;

<table><thead><tr><th width="243.5546875" valign="top">Visibility</th><th>Description</th></tr></thead><tbody><tr><td valign="top"><code>private</code></td><td>Default for new integrations. Only members from the organization defined in the integration's manifest will be able to install the integration.</td></tr><tr><td valign="top"><code>unlisted</code></td><td>Members from any organization can install the integration. The integration will only be available to install via it's shared install link.</td></tr><tr><td valign="top"><code>public</code></td><td>Members from any organization can install the integration. Integrations wanting to submit to the marketplace must use this visibility.</td></tr></tbody></table>

### Submitting to GitBook's Integration Marketplace

In order for your integration to be listed on our Marketplace, you will need to go through our submission process.&#x20;

See [submitting your app for review](../marketplace/submit-your-app-for-review.md) for more info.
