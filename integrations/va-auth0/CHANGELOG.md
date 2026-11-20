# @gitbook/integration-va-auth0

## 0.6.2

### Patch Changes

- dc3f60b: Report recognized authentication, saved configuration and input failures with safe recovery guidance. Keep provider outages, rate limits and malformed responses unexpected, and preserve existing preview fallbacks and custom authentication responses.
- Updated dependencies [2084c5a]
- Updated dependencies [dc3f60b]
  - @gitbook/api@0.212.0
  - @gitbook/runtime@0.26.1

## 0.6.1

### Patch Changes

- 16c96f1: Rebuild all built-in integrations with the updated runtime’s support for recoverable errors and safe handling of integration authentication failures.

## 0.6.0

### Minor Changes

- d0f1af0: Sign visitors out of Auth0 when they log out of a site with authenticated access.

## 0.5.0

### Minor Changes

- d7cf3b5: Add support for Auth0 invitation flow to integration

## 0.4.0

### Minor Changes

- 781f78a: Update VA/OIDC integrations to use upstream provider token's expiry

### Patch Changes

- 7414b8b: Use expires_in from /token resp for Auth0 as tokens are opaque

## 0.3.0

### Minor Changes

- db68a17: Add support to VA Auth0 integration to include claims from backend in token

### Patch Changes

- Updated dependencies [9dd3c5f]
  - @gitbook/api@0.79.0

## 0.2.0

### Minor Changes

- 65e6924: Update the completion action for integrations controlling their own configuration

## 0.1.1

### Patch Changes

- e0efa2c: Remove space code from VA integrations

## 0.1.0

### Minor Changes

- ee488d1: Bump integrations' target

## 0.0.9

### Patch Changes

- 5dabe91: Add and enforce HTTPS for domains in VA configuration of Auth0

## 0.0.8

### Patch Changes

- 6181f25: Move VA integrations to their own category

## 0.0.7

### Patch Changes

- 15a814a: Add site:metadata:read scope to VA integrations

## 0.0.6

### Patch Changes

- 6c303a0: Add site configuration object in manifest for integration that can be installed on sites

## 0.0.5

### Patch Changes

- 4271881: Update existing VA Integrations to support site installations

## 0.0.4

### Patch Changes

- dbc6c1e: Add more logs

## 0.0.3

### Patch Changes

- d06c529: Move Redirect URI instructions above the save button

## 0.0.2

### Patch Changes

- 4674af3: Improve logging for VA integrations
