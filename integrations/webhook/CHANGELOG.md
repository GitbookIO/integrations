# @gitbook/integration-webhook

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

- 1fa30e2: Added support for site events and secret regeneration.

### Patch Changes

- 7a8ee22: Introduce the Webhook integration and bumps api and cli to latest openapi spec.
- 1e572d3: Simpler config screens and fix documentation links in webhook integration.
- Updated dependencies [7a8ee22]
  - @gitbook/api@0.143.0
