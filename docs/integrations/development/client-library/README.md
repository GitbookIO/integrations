---
description: Install and use GitBook's official Node.js client library
---

# Client library

### Overview

GitBook provides an official TypeScript/JavaScript client for the [HTTP API](../../../gitbook-api/api-reference/). This client can be used in a browser or Node.js environment.&#x20;

### Installation

When [bootstrapping an integration using the GitBook CLI](../../quickstart.md#bootstrap-your-app), the library will be installed by default. If you need to, you can also install the GitBook Node.js library through `npm`.

```bash
npm install @gitbook/api
```

### Initialize the client

To start using the GitBook client library, you’ll first need to initialize the library with your [developer token](../../quickstart.md#create-a-personal-access-token).&#x20;

```typescript
import { GitBookAPI } from '@gitbook/api';

const client = new GitBookAPI({
  authToken: <your_access_token>
});
```

#### Usage with Node.js

When using the `@gitbook/api` module with Node.js < v18, you should pass a custom `fetch` function.

You can install one using the [`node-fetch`](https://github.com/node-fetch/node-fetch) module.

```typescript
import { GitBookAPI } from '@gitbook/api';
import fetch from 'node-fetch';

const client = new GitBookAPI({
  customFetch: fetch
});
```
