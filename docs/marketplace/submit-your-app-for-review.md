# Submit your app for review

Our public integration marketplace is continuously growing, and we'd love to add and feature any integrations you and your team are working on.

Before we add an integration to our public listing, all apps must go through our standard submission process. In a broad sense, it looks as follows:&#x20;

* Build an integration locally
* Publish your integration
* Test your integration with others
* Prepare assets for your integration
* Submit to GitBook's Integration Marketplace
* Integrations accepted and published :tada:

### Build an integration

Before you can submit an integration, you'll need to build one! Every great integration starts from an idea—There's nothing too big or too small!&#x20;

If you're looking for inspiration on what to build next, head to our [community](https://github.com/GitbookIO/community) or explore some already [existing integrations](https://www.gitbook.com/integrations) to spark some creativity.

If you're ready to start building, you can follow our [Setup Guide](../getting-started/setup-guide.md) to get started.

### Publish your integration

After you've built your integration - you'll need to publish it to GitBook's Integration Platform. This will allow you to install your app in any spaces you're a part of, or share your app with others.&#x20;

See the [Publishing section](../getting-started/publishing.md) to learn more.

### Test your integration

We want the best experience for our GitBook users, and want the integrations they use to enhance the way they work in the app.&#x20;

After publishing your app, it's important to test it with others outside of your organization, to collect feedback and help identify any bugs or issues that might have been missed during the initial development of your app.

Some considerations and areas to keep in mind when testing:

* How is the end user experience of my integration?
* Is the integration fully functional?
* Are there any edge cases that weren't considered?
* Does the integration expose any private or insecure data?

### Prepare assets

Once you're happy with your integration, you'll need to provide some assets with your submission before it's accepted. All assets can be specified and added in your integration's [`gitbook-manifest.yaml`](../integrations/configurations.md) file, which will be displayed in the integration's listing page after it's published.

To make things easier, we've prepared a Figma template you can use to create assets for your integration that meet our design requirements.

[**Figma Template**](https://www.figma.com/file/9FCuynZip3iJnlu0zB80ve/GitBook---Integrations-Template/duplicate)

**Example**:

<figure><img src="../.gitbook/assets/Screenshot 2023-05-04 at 14.51.08.png" alt=""><figcaption><p>Integration listing page</p></figcaption></figure>

Some important assets that are required and provide public facing information:

**Icon**

The main icon for your integration. It's should be high-resolution, and a 1:1 aspect ratio (recommended: `512px` × `512px`).

**Preview Images**

Any images you would like to include with your integration. Each image should be high-resolution. (recommended: `1570px` × `900px`)

**Summary**

A summary for your integration that will be displayed under any provided preview images. Supports markdown.

**Description**

A short description for your integration. Will be displayed on the right side of your integration's listing page, under the name.

**Categories**

A list of categories your integration falls into. Will be used to sort and filter through integrations from GitBook's integration page.

**External Links**

A list of external links for your integration. Will be displayed on the left side of your integration's listing page.

### Submit your integration

After you've reviewed your integration, tested it with others, and prepared assets—You're ready to submit it to GitBook's integration marketplace!&#x20;

You will need to provide some details for us, such as:&#x20;

* Name
* Contact email address
* Published integration name
* Link to code repository (Must be public, or access for GitBook staff if private)

When you have everything prepared, you can submit your integration using [this form](https://forms.gle/SXBdguvquFsCUtDX8).

