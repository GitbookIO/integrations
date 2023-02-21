# GitBook Integrations Platform

Welcome to GitBook Integrations Platform!

This repository contains code, packages, and scripts related to the integrations platform in GitBook. 

## Documentation
Read the [documentation](https://developer.gitbook.com/) to learn how to use
the GitBook Integration Platform with our API reference, getting started guides, and more.

> The documentation is hosted on GitBook and lives in this repository, within
> [`/docs`](./docs).

## Packages

This repository contains:
- [`@gitbook/cli`](./packages/cli/): CLI to build and publish integrations for GitBook
- [`@gitbook/api`](./packages/api/): API client got GitBook
- [`@gitbook/runtime`](./packages/runtime/): Core library to easily write integrations

## Integrations

It also hosts the default integrations provided by the GitBook team:

- [`slack`](./integrations/slack/)
- [`segment`](./integrations/segment/)
- [`webhook`](./integrations/webhook/)

## Contributing

After making a change, run `npm run changeset` to describe your changes.
To publish the packages, you can run:
- `npm run version-packages` to create new local versions from the changes
- `npm run release` to publish the packages to NPM
