# `@gitbook/api`

Javascript (Browser and Node) API client for the [GitBook API](https://developer.gitbook.com/).

## Installation

```
npm install @gitbook/api
```

## Usage

```ts
import { GitBookAPI } from '@gitbook/api';

const gitbook = new GitBookAPI({
    authToken: 'gb_abc,
});

const { data } = await gitbook..spaces.getSpaceById('abc');
```
