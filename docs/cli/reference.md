# Reference

References for the command line utility `gitbook`. The CLI can be used to create, test and publish integrations for the GitBook Integrations platform, and to call the GitBook API directly.

Install the CLI using `npm install @gitbook/cli -g`.

Most of the command tree is generated from the GitBook API: each API operation is exposed as a command group, e.g. `gitbook organizations list` or `gitbook spaces get <space>`. Run `gitbook --help` to explore them, and `gitbook completion --install` to set up shell completion. The commands below are the authentication and integration-lifecycle commands.

## `gitbook login`

Authenticate the CLI through your browser using OAuth. Running the command opens GitBook in your default browser, prompts you to authorize the CLI, and stores the resulting token locally. Access tokens are refreshed automatically as needed.

> Publishing integrations (`gitbook integration publish` / `unpublish`) is not available with a browser session and still requires a personal API token — use `gitbook auth` for those.

## `gitbook logout`

Remove the authentication stored for the current environment.

## `gitbook auth`

Authenticate the CLI with a GitBook Developer API token. You can generate a personal developer token in your [GitBook Developer settings](https://app.gitbook.com/account/developer).

The token can also be provided using the command line argument `--token=<token>`; if none is provider, it'll be prompted.

## `gitbook integration new <dir>`

Create and initialize a new integration locally. The program will prompt for information about the integration.

## `gitbook integration dev <spaceId>`

Create a live connection with a space within your GitBook organization. Updates made locally while the connection is running will automatically be received in the chosen space.&#x20;

See the [development section](../getting-started/development.md) to learn more.

## `gitbook integration publish`

Publish the integration defined in the `gitbook-manifest.yaml` file. See the [GitBook Manifest reference](broken-reference) documentation to learn more.

See the [publishing section](../getting-started/publishing.md) to learn more about publishing your integration to GitBook.

## `gitbook integration unpublish <integration-name>`

Unpublish your integration from the GitBook integration platform. Pass the name of the integration as an argument to the command.

> The integration lifecycle commands (`new`, `dev`, `publish`, `unpublish`, `tail`, `check`) are also accepted at the top level (`gitbook publish`, …) as deprecated aliases that print a warning. Prefer the `gitbook integration <verb>` form.

## `gitbook whoami`

Print information about the currently authenticated user.

## `gitbook help`

View the GitBook CLI commands and information on using them.
