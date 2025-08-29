# @gitbook/integration-gitlab

## 0.5.3

### Patch Changes

- a1c3335: Update documentation links

## 0.5.2

### Patch Changes

- 953d82a: Throw 400 exposable errors instead of internal errors when Git sync config value are missing/incomplete

## 0.5.1

### Patch Changes

- 62f857f: Don't catch router errors to allow them to be caught and processed in GitHub and GitLab integrations

## 0.5.0

### Minor Changes

- 9bce519: Use ExposableError for public errors in GitLab integration

## 0.4.0

### Minor Changes

- ee488d1: Bump integrations' target

## 0.3.0

### Minor Changes

- 0b70110: Update configuration of GitSync integrations

## 0.2.0

### Minor Changes

- c3e0c55: GitHub & GitLab: Normalize project directory to always be a relative path

## 0.1.0

### Minor Changes

- c07f41e: Fix an issue where GitBook was showing the wrong repository URL in published content.

## 0.0.15

### Patch Changes

- 19f14fd: Normalize custom instance URL for gitlab sync

## 0.0.14

### Patch Changes

- 69c2691: Use environment.signingSecrets instead of deprecated environment.signingSecret to verify signatures

## 0.0.13

### Patch Changes

- 7d76dfb: Update integrations to use latest runtime and api client with `User-Agent`
- Updated dependencies [46c9686]
    - @gitbook/runtime@0.11.0
    - @gitbook/api@0.27.0

## 0.0.12

### Patch Changes

- 391aea5: Bump to use the latest runtime@0.10.3

## 0.0.11

### Patch Changes

- f86ac5d: Release with the latest @gitbook/runtime@0.10.2

## 0.0.10

### Patch Changes

- 84c0202: Exit early from space_content_updated if not configured

## 0.0.9

### Patch Changes

- 1ac9975: check webhookId exists before deleting it in gitlab

## 0.0.8

### Patch Changes

- d648cc2: Release to use the latest runtime package

## 0.0.7

### Patch Changes

- 9285fe2: Release

## 0.0.6

### Patch Changes

- 8e40049: Release

## 0.0.5

### Patch Changes

- 3373bce: Release

## 0.0.4

### Patch Changes

- a7e2098: Release

## 0.0.3

### Patch Changes

- 37e4590: Release

## 0.0.2

### Patch Changes

- d3622ef: Release

## 0.0.1

### Patch Changes

- 2c3fecc: skip import or export git sync operations if no configuration found
