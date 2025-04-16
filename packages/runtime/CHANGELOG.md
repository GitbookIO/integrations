# @gitbook/runtime

## 0.20.0

### Minor Changes

- 6dfb882: Add support for site installation in createOAuthHandler

## 0.19.2

### Patch Changes

- 89b1298: Allow to inject props in OpenAPI configuration

## 0.19.1

### Patch Changes

- 99ac594: Update OpenAPI spec parsing and take order of tags in consideration
- Updated dependencies [c24bcd1]
    - @gitbook/api@0.96.1

## 0.19.0

### Minor Changes

- ff3ac23: Add support for computed content sources

### Patch Changes

- Updated dependencies [0d67d6e]
    - @gitbook/api@0.95.0

## 0.18.0

### Minor Changes

- ebfa12c: Add APIs to define and expose content sources

### Patch Changes

- Updated dependencies [a5d441f]
    - @gitbook/api@0.92.0

## 0.17.0

### Minor Changes

- a1b07be: Add support for new render output types

### Patch Changes

- Updated dependencies [597ba64]
    - @gitbook/api@0.67.0

## 0.16.0

### Minor Changes

- 4842312: Add two new UI elements, configuration and stepper

### Patch Changes

- Updated dependencies [0cd6eb4]
    - @gitbook/api@0.65.0

## 0.15.0

### Minor Changes

- 09ac8f9: Improve typing and utilies for OAuth
- 09ac8f9: Export a `ExposableError` to show errors to the end users
- 09ac8f9: Improve overall typing and utilities for ContentKit components

## 0.14.1

### Patch Changes

- cebbcb6: Updating inject scripts integration to support sites installations

## 0.14.0

### Minor Changes

- 1e3c023: return 4xx error instead of 5xx when failed to extract access token

## 0.13.0

### Minor Changes

- 41fa1ec: Add support for fetch_visitor_authentication event

### Patch Changes

- Updated dependencies [0961cf4]
    - @gitbook/api@0.31.0

## 0.12.0

### Minor Changes

- fe26302: Bump runtime to use the latest openAPI spec

## 0.11.0

### Minor Changes

- 46c9686: Allow passing a `userAgent` to the API client (`@gitbook/api`) and set a default user-agent for all integrations

### Patch Changes

- Updated dependencies [46c9686]
    - @gitbook/api@0.27.0

## 0.10.3

### Patch Changes

- 95f041a: Add more logs during OAuth flow

## 0.10.2

### Patch Changes

- dfd610b: Use status from error.code for GitBookAPIError errors

## 0.10.1

### Patch Changes

- b607365: Fix worker dispatch catch handler to send a http response with the status code instead of throwing an error

## 0.10.0

### Minor Changes

- 619e1e9: Add support for using functions as components in JSX

### Patch Changes

- Updated dependencies [619e1e9]
    - @gitbook/api@0.14.0

## 0.9.0

### Minor Changes

- 4affdac: Add ContentKit support for codeblock element for input

### Patch Changes

- Updated dependencies [4affdac]
    - @gitbook/api@0.9.0

## 0.8.0

### Minor Changes

- 4b40290: Pass FetchEvent down to the integration

### Patch Changes

- e828239: Fixes that externalIds and space_selection is passed to the install

## 0.7.0

### Minor Changes

- b2c17f4: Pass FetchEvent down to the integration

## 0.6.0

### Minor Changes

- fecaf55: Update createOAuthHandler signature to allow passing an optional options object

## 0.5.0

### Minor Changes

- Update JSX for @gitbook/runtime

## 0.4.1

### Patch Changes

- 0768f10: Fix OAuth handler crashing due lack of optional chaining use while reading spaceInstallation

## 0.4.0

### Minor Changes

- 2b19969: Use a JSON encoded state for OAuth state

## 0.3.0

### Minor Changes

- 882996d: Accept application/json by default for OAuth token response

## 0.2.0

### Minor Changes

- 0a17e3b: Dispatch version checked in production only

## 0.1.0

### Minor Changes

- b05a1dd: Publish @gitbook/runtime to NPM

## null

### Minor Changes

- e36efa5: Remove old, unused runtime
- d762a7c: Add method element.setCache during rendering of component to define the max-age
- 9fa2838: Added a Mailchimp integration
- ce12efa: Expose createComponent and "components" option in createIntegration to define ContentKit components

### Patch Changes

- 782d91b: Allow `createOAuthHandler` to update the entire installation (including the externalIds)
- 5df9eff: Fixed a few bugs in the slack integration
    - The channels endpoint didn't support pagination and that could lead to some unexpected behaviors due to the inherent weirdness of the slack API. See context here: https://github.com/GitbookIO/support-bucket/issues/961
    - The README was missing the signing secret step for publishing an integration.
    - There was a bug where the signature validation code would lock the body by reading it, which made it throw once the event tried to read from it again. Solved with a request clone.
    - There was an issue in the slack manifests where we would call the events path for `url_verifications`, but that should happen under `events_task`.
- Updated dependencies [f0c07cb]
- Updated dependencies [782d91b]
    - @gitbook/api@null
