# @gitbook/integration-cognito

## 0.5.2

### Patch Changes

- dc3f60b: Report recognized authentication, saved configuration and input failures with safe recovery guidance. Keep provider outages, rate limits and malformed responses unexpected, and preserve existing preview fallbacks and custom authentication responses.
- Updated dependencies [2084c5a]
- Updated dependencies [dc3f60b]
  - @gitbook/api@0.212.0
  - @gitbook/runtime@0.26.1

## 0.5.1

### Patch Changes

- 16c96f1: Rebuild all built-in integrations with the updated runtime’s support for recoverable errors and safe handling of integration authentication failures.

## 0.5.0

### Minor Changes

- d0f1af0: Sign visitors out of Amazon Cognito when they log out of a site with authenticated access.

## 0.4.0

### Minor Changes

- 781f78a: Update VA/OIDC integrations to use upstream provider token's expiry

## 0.3.0

### Minor Changes

- 72b9273: Add support to VA Cognito integration to include user claims from backend in token

### Patch Changes

- Updated dependencies [30caa3e]
  - @gitbook/api@0.93.0

## 0.2.0

### Minor Changes

- 65e6924: Update the completion action for integrations controlling their own configuration

## 0.1.1

### Patch Changes

- e0efa2c: Remove space code from VA integrations

## 0.1.0

### Minor Changes

- ee488d1: Bump integrations' target

## 0.0.5

### Patch Changes

- 6181f25: Move VA integrations to their own category

## 0.0.4

### Patch Changes

- 15a814a: Add site:metadata:read scope to VA integrations

## 0.0.3

### Patch Changes

- e989996: Make the Cognito integration public

## 0.0.2

### Patch Changes

- f83e65e: Add AWS Cognito integration
