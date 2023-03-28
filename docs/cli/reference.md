# Reference

References for the command line utility `gitbook`. The CLI can be used to create, test and publish integrations for the GitBook Integrations platform.

Install the CLI using `npm install @gitbook/cli -g`.

## `gitbook auth`

Authenticate the CLI with a GitBook Developer API token. You can generate a personal developer token in your [GitBook Developer settings](https://app.gitbook.com/account/developer).

The token can also be provided using the command line argument `--token=<token>`; if none is provider, it'll be prompted.

## `gitbook new <dir>`

Create and initialize a new integration locally. The program will prompt for information about the integration.

## `gitbook publish`

Publish the integration defined in the `gitbook-manifest.yaml` file. See the [GitBook Manifest reference](broken-reference) documentation to learn more.

See the [publishing section](../getting-started/publishing.md) to learn more about publishing your integration to GitBook.

## `gitbook unpublish`

Unpublish your integration from the GitBook integration platform.

## `gitbook whoami`

Print information about the currently authenticated user.

## `gitbook help`

View the GitBook CLI commands and information on using them.
