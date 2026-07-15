# Quickstart

### Step 1: Install the GitBook CLI

The GitBook Development CLI requires Node v18 or later. It can be installed from NPM using:

```
npm install @gitbook/cli -g
```

### Step 2: Authenticate with your account

Sign in through your browser:

```
gitbook login
```

Or, to publish integrations, authenticate with a personal API token instead. Create one at [app.gitbook.com/account/developer](https://app.gitbook.com/account/developer), then run:

```
gitbook auth --token <token>
```

> Publishing integrations requires a personal API token; the browser (OAuth) session cannot publish.

### Step 3: Bootstrap your app

Bootstrap your first app by running:

```
gitbook integration new
```
