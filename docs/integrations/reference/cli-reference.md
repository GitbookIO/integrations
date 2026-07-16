---
description: Explore the full reference guide for GitBook’s CLI commands
---

# CLI reference

### `gitbook auth`

Authenticate the CLI with a GitBook Developer API token. You can generate a personal developer token in your [GitBook Developer settings](https://app.gitbook.com/account/developer).

The token can also be provided using the command line argument `--token=<token>`; If none is provided, it'll be prompted.

### `gitbook integrations new <dir>`

Create and initialize a new integration locally. The program will prompt for information about the integration.

### `gitbook integrations dev`

Create a live connection from your integration to your GitBook editor. Updates made locally while the connection is running will automatically be received in the editor.

See the [development section](../development/) to learn more.

### `gitbook integrations publish`

Publish the integration defined in the `gitbook-manifest.yaml` file. See the [GitBook Manifest reference](../configurations.md) documentation to learn more.

See the [publishing section](../publishing.md) to learn more about publishing your integration to GitBook.

### `gitbook integrations unpublish <integration-name>`

Unpublish your integration from the GitBook integration platform. Pass the name of the integration as an argument to the command.

### `gitbook whoami`

Print information about the currently authenticated user.

### `gitbook help`

View the GitBook CLI commands and information on using them.
