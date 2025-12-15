---
description: List your integration on GitBook’s verified integration page
icon: paper-plane
---

# Submit your integration for review

After [bootstrapping](quickstart.md) and [publishing](publishing.md) an integration, you’re already able to install and use it [via the install link](quickstart.md#install-and-use-your-integration) returned from the CLI.&#x20;

If you’d like to add your integration to the public, verified integrations page in GitBook, you’ll need to go through a few more steps.

### Publish your integration publicly

After you've built your integration you'll need to publish it to GitBook's Integration Platform. This will allow you to install your app in any spaces you're a part of, or share your app with others.

Before submitting your app, you'll need to make sure you set your app's `visibility` to `public` in the `gitbook-manifest.yaml` file. This is required so we can test and see your application outside of your organization.

See the [Publishing section](publishing.md) to learn more.

### Test your integration with others

We want the best experience for our GitBook users, and want the integrations they use to enhance the way they work in the app.

After publishing your app, it's important to test it with others outside of your organization, to collect feedback and help identify any bugs or issues that might have been missed during the initial development of your app.

Some considerations and areas to keep in mind when testing:

* How is the end user experience of my integration?
* Is the integration fully functional?
* Are there any edge cases that weren't considered?
* Does the integration expose any private or insecure data?

### Prepare assets

Once you're happy with your integration, you'll need to provide some metadata with your submission before it's accepted. All metadata can be specified and added in your integration's [`gitbook-manifest.yaml`](configurations.md) file, which will be displayed in the integration's listing page after it's published.

{% hint style="info" %}
To make things easier, we've [created a website](https://integrate-vs.lovable.app/) you can use to create preview images and icons for your integration that meet our design requirements.
{% endhint %}

#### **Name**

This is the name for your integration — and **must be unique across all GitBook integrations**. This name should also be descriptive and specific for your integration. A good rule of thumb is to not include the following things to your integration’s name:

* `-gitbook`
* `-integration`

#### **Icon**

The main icon for your integration. It should be high-resolution, and a 1:1 aspect ratio — we recommend and image size of 512 × 512px.

#### **Preview images**

Any images you would like to include with your integration. Each image should be high-resolution. (recommended: `1600px` × `800px`, aspect ratio: `2:1`)

#### **Summary**

A summary for your integration that will be displayed under any provided preview images. Supports markdown.

#### **Description**

A short description for your integration. Will be displayed on the right side of your integration's listing page, under the name.

#### **Categories**

A list of categories your integration falls into. Will be used to sort and filter through integrations from GitBook's integration page.

#### **External links**

A list of external links for your integration. Will be displayed on the left side of your integration's listing page.

### Submit your integration

Once you've reviewed your integration, tested it with others, and prepared assets, you're ready to submit it to GitBook's integration marketplace!

You will need to provide some details for us, such as:

* Name
* Contact email address
* Published integration name
* Link to code repository (Must be public, or access for GitBook staff if private)
* Installation link for your integration

When you have everything prepared, you can submit your integration using [this form](https://forms.gle/SXBdguvquFsCUtDX8).
