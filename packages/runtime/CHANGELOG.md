# @gitbook/runtime

## 0.3.0

### Minor Changes

-   882996d: Accept application/json by default for OAuth token response

## 0.2.0

### Minor Changes

-   0a17e3b: Dispatch version checked in production only

## 0.1.0

### Minor Changes

-   b05a1dd: Publish @gitbook/runtime to NPM

## null

### Minor Changes

-   e36efa5: Remove old, unused runtime
-   d762a7c: Add method element.setCache during rendering of component to define the max-age
-   9fa2838: Added a Mailchimp integration
-   ce12efa: Expose createComponent and "components" option in createIntegration to define ContentKit components

### Patch Changes

-   782d91b: Allow `createOAuthHandler` to update the entire installation (including the externalIds)
-   5df9eff: Fixed a few bugs in the slack integration
    -   The channels endpoint didn't support pagination and that could lead to some unexpected behaviors due to the inherent weirdness of the slack API. See context here: https://github.com/GitbookIO/support-bucket/issues/961
    -   The README was missing the signing secret step for publishing an integration.
    -   There was a bug where the signature validation code would lock the body by reading it, which made it throw once the event tried to read from it again. Solved with a request clone.
    -   There was an issue in the slack manifests where we would call the events path for `url_verifications`, but that should happen under `events_task`.
-   Updated dependencies [f0c07cb]
-   Updated dependencies [782d91b]
    -   @gitbook/api@null
