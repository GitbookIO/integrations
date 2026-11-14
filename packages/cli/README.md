# `@gitbook/cli`

Manage GitBook from the command line: browse and edit spaces and pages, create and merge
change requests, publish sites, and build and publish integrations. Run `gitbook --help` to
see every command.

### Step 1: Install the GitBook CLI

The GitBook CLI requires Node v18 or later. It can be installed from NPM using:

```
npm install @gitbook/cli -g
```

### Step 2: Authenticate with your account

The quickest way to sign in is through your browser:

```
gitbook login
```

This opens GitBook in your browser, asks you to authorize the CLI, and stores the resulting
token locally. Sessions are refreshed automatically.

`gitbook login` waits for the browser to redirect to a local server on `127.0.0.1`, so the
browser must run on the same machine as the CLI. Over SSH, in containers, in CI, or in
sandboxed agents, use an API token with `gitbook auth` instead.

Alternatively, authenticate with a personal API token. Create one at
[app.gitbook.com/account/developer](https://app.gitbook.com/account/developer), then run:

```
gitbook auth --token <token>
```

> **Note:** Publishing integrations (`gitbook integration publish` / `unpublish`) requires a
> personal API token — the browser (OAuth) session cannot perform those operations. Use
> `gitbook auth` for publishing workflows.

To sign out, run `gitbook logout`.

### Step 3: Bootstrap your app

Bootstrap your first app by running:

```
gitbook integration new
```
