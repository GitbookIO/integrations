# Use GitHub Actions to translate GitBook pages

### Overview

As far as any good documentation goes, accessibility — and [Internationalization](https://en.wikipedia.org/wiki/Internationalization\_and\_localization) (i18n) specifically — plays an important role.&#x20;

Translating documents and content has always been a tedious and manual task. Many times translating documents from one language to another isn’t straightforward. Luckily, we’re able to start using new and emerging tools to help us make our documents more accessible.&#x20;

While GitBook doesn’t have a native translation solution, our [Integration Platform](https://www.gitbook.com/integrations) allows you to extend the way you manage your content. And that includes the ability to introduce workflows that take the manual aspect out of translating content.

Let’s dive in!

### Collections

In order to translate your site, you’ll need to have some well-organized content. GitBook provides the perfect solution to structure sites available in multiple languages: [collections](https://gitbook.com/docs/content-creation/content-structure/what-is-a-collection).

Collections provide a way to group related spaces together. In the context of i18n, we will use one space for each language, with a space designated to hold the content in the primary language. You can think of this space as your “main” content.

Here’s an example of such a setup:

<div data-full-width="false">

<figure><img src="../../.gitbook/assets/Screenshot 2023-05-23 at 10.45.16.png" alt=""><figcaption><p>A collection with different spaces for each language</p></figcaption></figure>

</div>

In the example above, the space called _English_ is the main space that all the translations will be based on.

After you’ve set up the collection, you can use Git Sync to enable programmatic access to content.

### GitSync

[GitSync](https://gitbook.com/docs/product-tour/git-sync) is a feature in GitBook that allows you to connect a space to a remote repository hosted on either GitHub or GitLab (_starting to Git the hang of it?_).

You can check [out our setup video](https://www.youtube.com/watch?v=Fm5hYBsRSXo) to learn more about configuring GitSync in your Space.

{% hint style="warning" %}
**Important:** While your collection will include a space for each language in GitBook, you’ll need to connect each one to your remote repository separately.
{% endhint %}

Use the [Monorepo feature](https://gitbook.com/docs/product-tour/git-sync/monorepos) if you need to configure each space to a specific folder in your remote repository.

Once you’ve connected your GitBook spaces to a remote repository, we’ll run through how to add workflows on top of your content.

### GitHub Actions

In this guide, we’ll configure a workflow in GitHub using [GitHub Actions](https://github.com/features/actions).

{% hint style="info" %}
If you’re using GitLab, you can use their [built in CI/CD](https://docs.gitlab.com/ee/ci/) feature.
{% endhint %}

GitHub Actions allow you to run scripts or other utilities when certain events occur in a remote repository. In this case, we want to run an action every time someone makes a new update to the content.

Once you’ve configured Git Sync, any update you make in GitBook is automatically committed to the GitHub branch you configured, allowing you to tap into the update using GitHub Actions.

To configure the GitHub Action, you can add a `.github/workflows/action.yml` file at the root of your project.

Here’s an example `action.yml` file:

<pre class="language-yaml"><code class="lang-yaml"># This is a basic workflow to help you get started with Actions
<strong>name: GitHub Actions
</strong>
on:
  push:
    branches: ["main"]

jobs:
  translate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
</code></pre>

The example action above will run every time someone merges an update to the `main` branch — which means whenever someone merges a [change request](https://gitbook.com/docs/collaboration/collaboration/change-requests) in GitBook.&#x20;

Because this workflow runs after the content is merged, it will contain up-to-date information about the request, including the latest version of the content.&#x20;

You can now use this action to invoke a tool that will handle the translations.

### Translation Software

The power of having your workflow set up in code comes down to its flexibility — you have the choice of what tool you’d like to use to handle the translations. For example, you could use one of these AI tools, which can automate translations:

* [DeepL](https://www.deepl.com/)
* [OpenAI](https://openai.com/)
* [Google Cloud Translations](https://cloud.google.com/translate)

Each of the tools above comes with pros and cons. For example, some might provide better translations, but come at a higher cost, which others might have APIs that are easier to work with. The following sections cover some important things to keep in mind when choosing a tool for your translations.

### Considerations

As you choose a tool for translations, you’ll also be responsible for setting up the utility that handles the translation itself. Here are some things to keep in mind:

**Cost**

The cost of the tool you use is an important factor. While some tools provide a free plan to get you started, many translation tools require a paid plan in order to use them beyond demo purposes.&#x20;

It’s also important to think about the number of requests: is your team making a lot of changes to your content? Should your content be re-translated every time the content is updated? Should it be updated on a schedule?&#x20;

**Scope of changes**

If your team is making lots of isolated changes, you’ll need to adapt your strategy to handle translations. For instance, if you only update a single page, make sure your utility is only translating that specific page — not the entire space.

**Reviewing content**

While translation APIs are getting better each day, they’re not perfect — and in many cases you’ll want to have someone to review the translations.

Think about how the translated documents are submitted back into the main content. Should they be introduced in the form of a pull request, so your team can review the translations first?

It’s also important to keep in mind that if someone reviews a translated page, and it’s updated in the main branch, it will be translated again automatically, losing the changes from the review. You’ll be responsible for making sure the translated documents are up to date with the version that you’re happy with.

**Maintenance**

As with any project, maintenance is another key area of focus. You need to make sure that once the original setup is implemented, you maintain it in case any part involved in the solution changes, such as updates done to the tools you’re using.

### Wrapping up

GitBook lets you extend your workflows by seamlessly integrating with Git providers like GitHub or GitLab. On top of working with the workflows and actions mentioned in this guide, GitBook’s Integration Platform provides a set of tools that give you even more control over your content.&#x20;

From our REST API to creating custom blocks in GitBook, you can integrate many of the tools you already know and love directly into your sites.

Make sure you head to [GitBook Integrations](https://www.gitbook.com/integrations) to learn more!
