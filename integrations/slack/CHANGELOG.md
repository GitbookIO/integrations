# @gitbook/integration-slack

## 2.0.3

### Patch Changes

- a1c3335: Update documentation links

## 2.0.2

### Patch Changes

- 24eecd3: Fix an issue where Slack channels were not being correctly shown.

## 2.0.1

### Patch Changes

- e4ba11b: Remove category `captures` from the integration

## 2.0.0

### Major Changes

- 5238e32: Remove deprecated "save" feature, and fix ask questions

### Patch Changes

- e427c87: Update description
- Updated dependencies [5238e32]
    - @gitbook/api@0.91.0

## 1.4.0

### Minor Changes

- ee488d1: Bump integrations' target

## 1.3.0

### Minor Changes

- 80e4d20: Add an extra check for variables that may be undefined in space integrations

## 1.2.3

### Patch Changes

- 71d12f6: Updates the copy for the Slack Integration

## 1.2.2

### Patch Changes

- 15511c8: Updates the copy for the Slack Integration

## 1.2.1

### Patch Changes

- 42a58f7: Fix an issue where GitBook save was not working in Slack.

## 1.2.0

### Minor Changes

- 429285b: Updates to notifications showing direct page links

## 1.1.2

### Patch Changes

- 7d76dfb: Update integrations to use latest runtime and api client with `User-Agent`
- Updated dependencies [46c9686]
    - @gitbook/runtime@0.11.0

## 1.1.1

### Patch Changes

- d648cc2: Release to use the latest runtime package

## 1.1.0

### Minor Changes

- 3c8320c: Reformats the notifications into a list
- 9046bfb: Notify of space updates with a more detailed notification
- 58eee59: Adds support for snippets to be displayed in answers from GitBook AI

## 1.0.2

### Patch Changes

- 6faa977: Update term used in Save
- 0634853: Restrict usage from external connected slack channels
- Updated dependencies [619e1e9]
    - @gitbook/runtime@0.10.0

## 1.0.1

### Patch Changes

- 34c8c32: Fixes a regression that disabled link unfurling
- 945453d: Restricts unfurling of links from GitBook bot

## 1.0.0

### Major Changes

- f8c46f0: Complete presentation for the Slack integration

### Minor Changes

- 7ba4e32: Improve manifest copy
- 1fda277: Slack request verification

### Patch Changes

- 782d91b: Unfurl links in Slack and change configuration to use the name "channel"
- 7abce30: Adapt the Slack integration to handle incoming HTTP requests at the space installation level.
- 02817af: Update scopes for the integrations to match the new API spec
- a2bba42: Publish integrations into the GitBook organization in both staging and production in CI
- bd17ba3: Fixed documentation links
- 49f015a: Fix a crash when handling a link_shared event for an improperly configured installation
- d08888a: Improve Segment integration description
- 5df9eff: Fixed a few bugs in the slack integration
    - The channels endpoint didn't support pagination and that could lead to some unexpected behaviors due to the inherent weirdness of the slack API. See context here: https://github.com/GitbookIO/support-bucket/issues/961
    - The README was missing the signing secret step for publishing an integration.
    - There was a bug where the signature validation code would lock the body by reading it, which made it throw once the event tried to read from it again. Solved with a request clone.
    - There was an issue in the slack manifests where we would call the events path for `url_verifications`, but that should happen under `events_task`.
- Updated dependencies [e36efa5]
- Updated dependencies [d762a7c]
- Updated dependencies [782d91b]
- Updated dependencies [9fa2838]
- Updated dependencies [ce12efa]
- Updated dependencies [5df9eff]
    - @gitbook/runtime@null

## null

### Patch Changes

- d588454: Add support for publishing preview images and external links
