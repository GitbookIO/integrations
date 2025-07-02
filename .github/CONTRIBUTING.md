# Welcome to GitBook's contributing guide!

Thank you for investing your time in contributing to our integration platform! Any contribution you make will be reviewed by our team.

In this guide, you'll learn the differnt ways you can contribute to our platform!

## Types of Contributions

This repository contains code related to different parts of our integration platform. Depending on what you'd like to contribute to, head to the section below to find the necessary steps.

### Issues

#### Create a new issue

If you spot a problem within a repository, [search if an issue already exists](https://docs.github.com/en/github/searching-for-information-on-github/searching-on-github/searching-issues-and-pull-requests#search-by-the-title-body-or-comments). If a related issue doesn't exist, you can open a new issue [here](https://github.com/GitbookIO/integrations/issues/new/choose)!

Please make sure any added issues are

- Descriptive
- Thoughtful
- Organized

We recommend adding as many relevant links, minimal reproductions of the issue, and other materials that will help our team solve the issue fast.

#### Solve an issue

If you're interested in solving an issue in our repository, start by scanning through it's exisiting issues to find one that you're interested in working on. If you find an issue to work on, you are welcome to open a PR with a fix. See the following sections below for more information on contributing for specific sections.

### Docs
The official developer docs for GitBook, hosted on https://developer.gitbook.com/. Our documentation uses one of GitBook's most useful features-[Git Sync](https://gitbook.com/docs/product-tour/git-sync)!

Git Sync allows you to keep your GitBook site up to date with a remote repository either on GitHub or GitLab. In our case we have the [/docs](../docs/) directory synced with https://developer.gitbook.com/. This means that any changes reviewed, approved, and merged into this directory will automatically be deployed!

### Integrations
The integrations found in this repository are owned and maintained by the GitBook organization. If you're interested in creating your own integration - you can! Head to our [getting started guide](https://developer.gitbook.com/getting-started/setup-guide) to build your first integration.

If you're interested in contributing to any of our already published integrations that live in [/integrations](../integrations/), you're more than welcome to add or update any changes you think would make our integrations better. Every contribution will be reviewed and tested by our team.

### Packages
You're also welcome to contribute updates or improvements to the packages living in [/packages](../packages/). Head to each package's documentation page to learn more about what each one does.

`@gitbook/cli`: https://gitbook.com/docs/developers/integrations/reference
`@gitbook/api`: https://gitbook.com/docs/developers/gitbook-api/overview
`@gitbook/runtime`: https://gitbook.com/docs/developers/integrations/runtime

## Contributing

### Tooling
To start, make sure you have the appropriate tooling installed on your machine:

- [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
- [Install NodeJS](https://nodejs.org/en/download/)

### Make changes locally

1. Fork the repository.

- Using GitHub Desktop:

  - [Getting started with GitHub Desktop](https://docs.github.com/en/desktop/installing-and-configuring-github-desktop/getting-started-with-github-desktop) will guide you through setting up Desktop.
  - Once Desktop is set up, you can use it to [fork the repo](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/cloning-and-forking-repositories-from-github-desktop)!

- Using the command line:

  - [Fork the repo](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo#fork-an-example-repository) so that you can make your changes without affecting the original project until you're ready to merge them.

- GitHub Codespaces:
  - [Fork, edit, and preview](https://docs.github.com/en/free-pro-team@latest/github/developing-online-with-codespaces/creating-a-codespace) using [GitHub Codespaces](https://github.com/features/codespaces) without having to install and run the project locally.

2. Create a working branch and start with your changes!

### Commit your update

[Commit your changes](https://github.com/git-guides/git-commit) once you are happy with them. See [Atom's contributing guide](https://github.com/atom/atom/blob/master/CONTRIBUTING.md#git-commit-messages) to know how to use emoji for commit messages!

Once your changes are ready, don't forget to self-review your code to double check that your chagnes are ready to be added.

### Pull Request

When you're finished with the changes, [create a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request), also known as a PR.

- Don't forget to [link PR to issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) if you are solving one.
- Enable the checkbox to [allow maintainer edits](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/allowing-changes-to-a-pull-request-branch-created-from-a-fork) so the branch can be updated for a merge.
  Once you submit your PR, a GitBook team member will review your proposal. We may ask questions or request for additional information.
- We may ask for changes to be made before a PR can be merged, either using [suggested changes](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/incorporating-feedback-in-your-pull-request) or pull request comments. You can apply suggested changes directly through the UI. You can make any other changes in your fork, then commit them to your branch.
- As you update your PR and apply changes, mark each conversation as [resolved](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/commenting-on-a-pull-request#resolving-conversations).
- If you run into any merge issues, checkout this [git tutorial](https://lab.github.com/githubtraining/managing-merge-conflicts) to help you resolve merge conflicts and other issues.

### Your PR is merged

Congratulations 🎉 

Thank you for your contribution! Once your PR is merged, your contributions will be publicly visible on the relevant repository.