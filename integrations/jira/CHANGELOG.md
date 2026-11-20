# @gitbook/integration-jira

## 0.2.5

### Patch Changes

- dc3f60b: Report recognized authentication, saved configuration and input failures with safe recovery guidance. Keep provider outages, rate limits and malformed responses unexpected, and preserve existing preview fallbacks and custom authentication responses.
- 8f82c0d: Persist rotated Jira OAuth credentials without depending on site discovery. Keep the sites saved during authorization when refreshing the access token.
- Updated dependencies [2084c5a]
- Updated dependencies [dc3f60b]
  - @gitbook/api@0.212.0
  - @gitbook/runtime@0.26.1

## 0.2.4

### Patch Changes

- 16c96f1: Rebuild all built-in integrations with the updated runtime’s support for recoverable errors and safe handling of integration authentication failures.

## 0.2.3

### Patch Changes

- 6c91f6d: Update integrations to support new Oauth transaction Id
- Updated dependencies [6c91f6d]
- Updated dependencies [92a6f32]
  - @gitbook/runtime@0.25.0
  - @gitbook/api@0.209.0

## 0.2.2

### Patch Changes

- 126f152: Update images to 2x exports

## 0.2.1

### Patch Changes

- 8a8a07d: Update preview images and old logos
- 8a8a07d: Update images

## 0.2.0

### Minor Changes

- 1bfa2e3: Prevent Jira embed render to fail when its configuration is incomplete
