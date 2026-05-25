---
description: Install the GitBook CLI to build and publish integrations
icon: rectangle-terminal
---

# Install the CLI

The CLI can be used to create, test and publish integrations for GitBook’s integration platform. To start using the CLI, you’ll first need to install it globally on your machine:

```bash
npm install @gitbook/cli -g
```

After installing the CLI, you’ll need to authenticate your user in order to create and publish an integration.

To authenticate your user, run:

```bash
gitbook auth
```

This will prompt you to add your developer token from your GitBook account. You can generate a personal developer token in your [GitBook Developer settings](https://app.gitbook.com/account/developer).

After authenticating your user, you’ll be able to bootstrap an integration, publish an integration, and more. Refer to the [Quickstart](../quickstart.md) to learn more about building an integration using the CLI.
