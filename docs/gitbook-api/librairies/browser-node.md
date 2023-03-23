---
description: GitBook's official Node.js client library.
---

# Node.js

## Overview

GitBook provides an official Typescript/Javascript client for the HTTP API. This client can be used in a browser or Node.js environment.

## Installation

```
npm install @gitbook/api
```

## Usage

#### General usage:

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
