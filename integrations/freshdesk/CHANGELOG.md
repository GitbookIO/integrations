# @gitbook/integration-freshdesk

## 1.1.2

### Patch Changes

- dc3f60b: Report recognized authentication, saved configuration and input failures with safe recovery guidance. Keep provider outages, rate limits and malformed responses unexpected, and preserve existing preview fallbacks and custom authentication responses.
- Updated dependencies [2084c5a]
- Updated dependencies [dc3f60b]
  - @gitbook/api@0.212.0
  - @gitbook/runtime@0.26.1

## 1.1.1

### Patch Changes

- 16c96f1: Rebuild all built-in integrations with the updated runtime’s support for recoverable errors and safe handling of integration authentication failures.

## 1.1.0

### Minor Changes

- d565165: Update Freshdesk configuration options

## 1.0.1

### Patch Changes

- Switch configuration from widget ID to full widget URL, and inject that URL directly to support regional Freshworks widget domains.

## 1.0.0

### Major Changes

- cf0f7ab: Initial publish
