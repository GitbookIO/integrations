# Use GitHub Actions to translate GitBook pages

### Overview

As far as any good documentation goes, it's accessibility plays a big part of how useful it can be—and [Internationalization](https://en.wikipedia.org/wiki/Internationalization\_and\_localization) (i18n) has a big part to do with that.&#x20;

Translating documents and content has always been a rough and manual task - and many times translating documents from one language to another aren't completely straightforward. Luckily, we're able to start using new and emerging tools to help us make our documents more accessible.&#x20;

While GitBook doesn't have a built in translation solution, our Integration Platform allows you to extend the way you manage your content - including allowing you to introduce workflows that take the manual part out of translating your work.

Let's dive in!

### Collections

In order for you to start translating your site, you'll need to have some content, and make sure it's organized!&#x20;

GitBook provides the perfect solution for you to organize your content in different languages - [Collections](https://docs.gitbook.com/content-creation/content-structure/what-is-a-collection)!&#x20;

Collections allow you to create a "folder" of sorts, that you can add different spaces to! In our case, we can think of 1 space equal to 1 language.

To create a collection in [GitBook](https://app.gitbook.com/), head to the blue button in the lower left corner!

You'll need to have a space inside a collection for every language you want to translate into, but only one space in the collection with content in it - you can think of this space as your "main" content.

Your setup might look something like this:

<figure><img src="../../.gitbook/assets/Screenshot 2023-05-23 at 10.45.16.png" alt=""><figcaption><p>A collection with different spaces for each language</p></figcaption></figure>

In the example above, the space called "_English_" is the main space that all the translations will come from.

After you have a collection set up with different spaces, you're then able to use another powerful feature in GitBook that gives you more control over the content you're working on.

### GitSync

[GitSync](https://docs.gitbook.com/product-tour/git-sync) is a feature in GitBook that allows you to connect a space to a remote repository hosted on either GitHub or GitLab (_starting to Git the hang of it?_).

This guide won't go deep into setting up GitSync, but you can check out our setup video to learn more about [configuring GitSync in your Space](https://www.youtube.com/watch?v=Fm5hYBsRSXo).

{% hint style="warning" %}
It's important to note that while you will have multiple spaces set up in GitBook for each language, you'll need to connect each space separately to your remote repository.
{% endhint %}

You can make use of the [Monorepo feature](https://docs.gitbook.com/product-tour/git-sync/monorepos) to configure each space to a specific folder or directory in your remote repository.

Now that you have your GitBook project set up to a remote repository, you can explore some of the ways you can add workflows on top of your content.

### GitHub Actions

In this guide, we'll be exploring a workflow setup in GitHub - [GitHub Actions](https://github.com/features/actions).

{% hint style="info" %}
If you're using GitLab, you'll want to explore their [built in CI/CD](https://docs.gitlab.com/ee/ci/) feature.
{% endhint %}

GitHub Actions allow you to run scripts or other utilities when certain things happen in a remote repository—In our case, when a new update is made to the content!&#x20;

If you have GitSync enabled with GitHub, any update you make in GitBook is automatically committed to your main branch in GitHub, allowing you to tap into the update through GitHub actions.

You'll need to configure this by adding a `.github/workflows/action.yml` file at the root of your project.

An example file looks something like this:

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

The example above will run every time an update is merged to main—In GitBook terms, this means any time a [Change Request](https://docs.gitbook.com/collaboration/collaboration/change-requests) is merged.&#x20;

Because this workflow runs after the content is merged, it will contain up to date information about the request, including the latest version of the content.&#x20;

From here, you can set up a tool that will handle the translations!

### Translation Software

The power of having your workflow setup in code comes down to it's flexibility - you have the choice of what tool you'd like to use to handle the translations. Here are some AI tools we've seen used:

* [DeepL](https://www.deepl.com/)
* [OpenAI](https://openai.com/)
* [Google Cloud Translations](https://cloud.google.com/translate)

Each of the tools above comes with it's Pro's and Con's—For example, some might provide better translations, but come at a higher cost. Some might have easier APIs to work with as well. The next sections covers some important things to keep in mind when choosing a tool for your translations.

### Considerations

As you choose a tool to do the translations, you'll also be responsible for setting up the utility that handles the translation itself. Here are some things to keep in mind:

**Cost**

The cost of the tool you use is a big thing to keep in mind. While some tools provide a free plan to get started with, many translation tools require a paid plan in order to use for more than demo purposes.&#x20;

It's also important to think about the number of requests being made - is your team making a lot of changes to your content? Should your content be re-translated every time the content is updated?Should it be updated on a schedule?&#x20;

**Requests**

If your team is making many requests, you'll want to think about how your translations are handled. For instance, if you only update one page, you will want to make sure your utility is only translating that specific page, instead of re-translating your entire site.

**Reviewing Content**

While translation APIs are getting better each day, they're not perfect—And in many cases you'll want to have someone reviewing the translations that are made.

You'll want to think about how the translated documents are submitted back into the main content. Should they be introduced in the form of a pull request, so your team can review the translations first?

It's also important to keep in mind, that if an already reviewed translated page is updated in the main branch and you re-translate the page, it might not include the original reviewed translations. You'll be responsible for making sure the translated documents are up to date with the version you're happy with.

**Maintenance**

As with any project, maintenance is another key area of focus. You'll want to make sure you have appropriate resources for not only hooking up all the pieces, but to maintain your project in case things change, like updates to any of the utilities or tools you're using.

### Wrapping up

GitBook allows you to extend the way you work by offering a flexible way of enhancing it's native workflows. On top of working with the workflows and actions mentioned in this guide, GitBook's Integration Platform provides a set of tools that give you even more control over your content.&#x20;

From our REST API to creating custom blocks in GitBook, you're able to integrate many of the tools you already know and love directly into the sites you're working on.

Make sure you head to [GitBook Integrations](https://www.gitbook.com/integrations) to learn more.
