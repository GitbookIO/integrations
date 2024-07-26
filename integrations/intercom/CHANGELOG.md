# @gitbook/integration-intercom

## 0.1.0

### Minor Changes

-   80e4d20: Add an extra check for variables that may be undefined in space integrations

### Patch Changes

-   Updated dependencies [a04dfb8]
    -   @gitbook/api@0.58.0

## 0.0.5

### Patch Changes

-   6c303a0: Add site configuration object in manifest for integration that can be installed on sites

## 0.0.4

### Patch Changes

-   cebbcb6: Updating inject scripts integration to support sites installations
-   Updated dependencies [cebbcb6]
    -   @gitbook/runtime@0.14.1

## 0.0.3

### Patch Changes

-   7d76dfb: Update integrations to use latest runtime and api client with `User-Agent`
-   Updated dependencies [46c9686]
    -   @gitbook/runtime@0.11.0
    -   @gitbook/api@0.27.0

## 0.0.2

### Patch Changes

-   d648cc2: Release to use the latest runtime package

## 0.0.1

### Patch Changes

-   162cb4b: Added prototypes for the intercom and google analytics integrations
-   bd17ba3: Fixed documentation links
-   704ae2b: Added the Plausible and Fathom integrations.

    Also added some logic to load script with the `.raw.js` extension as text in the integrations. This should make sure
    that script injection is as seamless to develop as the other parts of teh integration by allowing us to write code
    in script file, then loading it as a script during the build process.

-   a8bb4db: Fixed the manifests to make sure they can be deployed without being blocked by other work
-   Updated dependencies [f0c07cb]
-   Updated dependencies [e36efa5]
-   Updated dependencies [d762a7c]
-   Updated dependencies [782d91b]
-   Updated dependencies [782d91b]
-   Updated dependencies [9fa2838]
-   Updated dependencies [ce12efa]
-   Updated dependencies [5df9eff]
    -   @gitbook/api@null
    -   @gitbook/runtime@null
