---
icon: paper-plane
---

# Submit your app for review

Our public integration marketplace is continuously growing, and we'd love to review any integration you’re building.

Before we add an integration to our public listing, all apps must go through our standard submission process. In a broad sense, it looks as follows:

* Build an integration locally
* Publish your integration
* Test your integration with others
* Prepare assets for your integration
* Submit to GitBook's Integration Marketplace
* Integrations accepted and published :tada:

### Build an integration

Before you can submit an integration, you'll need to build one! Every great integration starts from an idea—There's nothing too big or too small!

If you're looking for inspiration on what to build next, head to our [community](https://github.com/GitbookIO/community) or explore some already [existing integrations](https://www.gitbook.com/integrations) to spark some creativity.

If you're ready to start building, you can follow our [Setup Guide](../getting-started/setup-guide.md) to get started.

### Publish your integration

After you've built your integration - you'll need to publish it to GitBook's Integration Platform. This will allow you to install your app in any spaces you're a part of, or share your app with others.

Before submitting your app, you'll need to make sure you set your app's `visibility` to `public` in the `gitbook-manifest.yaml` file. This is required so we can test and see your application outside of your organization.

See the [Publishing section](../getting-started/publishing.md) to learn more.

### Test your integration

We want the best experience for our GitBook users, and want the integrations they use to enhance the way they work in the app.

After publishing your app, it's important to test it with others outside of your organization, to collect feedback and help identify any bugs or issues that might have been missed during the initial development of your app.

Some considerations and areas to keep in mind when testing:

* How is the end user experience of my integration?
* Is the integration fully functional?
* Are there any edge cases that weren't considered?
* Does the integration expose any private or insecure data?

### Prepare assets

Once you're happy with your integration, you'll need to provide some assets with your submission before it's accepted. All assets can be specified and added in your integration's [`gitbook-manifest.yaml`](../integrations/configurations.md) file, which will be displayed in the integration's listing page after it's published.

To make things easier, we've prepared a [Figma template](https://www.figma.com/file/9FCuynZip3iJnlu0zB80ve/GitBook---Integrations-Template/duplicate) you can use to create assets for your integration that meet our design requirements.

#### **Name**

This is the name for your integration - and **must be unique across all GitBook integrations**. This name should also be descriptive and specific for your integration. A good rule of thumb is to not include the following things to your integration's name:

* `-gitbook`
* `-integration`

#### **Icon**

The main icon for your integration. It's should be high-resolution, and a 1:1 aspect ratio (recommended: `512px` × `512px`).

#### **Preview Images**

Any images you would like to include with your integration. Each image should be high-resolution. (recommended: `1600px` × `800px`, aspect ratio: `2:1`)

#### **Summary**

A summary for your integration that will be displayed under any provided preview images. Supports markdown.

#### **Description**

A short description for your integration. Will be displayed on the right side of your integration's listing page, under the name.

#### **Categories**

A list of categories your integration falls into. Will be used to sort and filter through integrations from GitBook's integration page.

#### **External Links**

A list of external links for your integration. Will be displayed on the left side of your integration's listing page.

### Submit your integration

After you've reviewed your integration, tested it with others, and prepared assets—You're ready to submit it to GitBook's integration marketplace!

_**Note:** Any apps submitted to the marketplace must be in general availability._

You will need to provide some details for us, such as:

* Name
* Contact email address
* Published integration name
* Link to code repository (Must be public, or access for GitBook staff if private)
* Installation link for your integration

When you have everything prepared, you can submit your integration using [this form](https://forms.gle/SXBdguvquFsCUtDX8).
