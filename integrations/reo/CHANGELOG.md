# @gitbook/integration-reo.dev

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

- 125bcb2: Add cookie banner to tracking integrations

## 0.4.0

### Minor Changes

- aac3f54: Add check to see if cookies should be disabled or not

### Patch Changes

- Updated dependencies [b72b44b]
  - @gitbook/api@0.131.0

## 0.3.2

### Patch Changes

- 126f152: Update images to 2x exports

## 0.3.1

### Patch Changes

- 8a8a07d: Update preview images and old logos
- 8a8a07d: Update images

## 0.3.0

### Minor Changes

- ee488d1: Bump integrations' target

## 0.2.1

### Patch Changes

- acdb30e: Update manifest files for integrations so they don't include unused scopes

## 0.2.0

### Minor Changes

- f3999b7: Updates all packages to remove the spaces configuration, and rely on the now used site configuration instead. Also removes instances of the spaces variable where applicable

## 0.1.0

### Minor Changes

- 80e4d20: Add an extra check for variables that may be undefined in space integrations

### Patch Changes

- Updated dependencies [a04dfb8]
  - @gitbook/api@0.58.0
