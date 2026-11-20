# @gitbook/integration-bucket

## 0.4.2

### Patch Changes

- dc3f60b: Report recognized authentication, saved configuration and input failures with safe recovery guidance. Keep provider outages, rate limits and malformed responses unexpected, and preserve existing preview fallbacks and custom authentication responses.
- Updated dependencies [dc3f60b]
  - @gitbook/runtime@0.26.1

## 0.4.1

### Patch Changes

- 16c96f1: Rebuild all built-in integrations with the updated runtime’s support for recoverable errors and safe handling of integration authentication failures.

## 0.4.0

### Minor Changes

- 10b67bc: Update Bucket integration for Bucket->Reflag rebrand

## 0.3.3

### Patch Changes

- f791b5b: Simplify syncing schema for Bucket & LaunchDarkly

## 0.3.2

### Patch Changes

- 673b740: Fix crashing of sync tasks

## 0.3.1

### Patch Changes

- a43880e: Fix integration tasks for adaptive schema sync

## 0.3.0

### Minor Changes

- 3c1983e: Use vstack/box layout for bucket integration

### Patch Changes

- a0ad513: Mark the integration as public

## 0.2.0

### Minor Changes

- a1698dd: Initial configuration state if adaptive content is not enabled

### Patch Changes

- e1842aa: Fix crash that was happening because of not using the installation token while fetching site in render

## 0.1.0

### Minor Changes

- ef13f61: Initial version
