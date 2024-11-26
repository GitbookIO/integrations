# @gitbook/cli

## 0.17.0

### Minor Changes

-   d3fcacc: Remove entities from CLI

### Patch Changes

-   Updated dependencies [d3fcacc]
    -   @gitbook/api@0.57.0

## 0.16.0

### Minor Changes

-   6646aac: Update the CLI to accommodate new category

## 0.15.2

### Patch Changes

-   65c7dc7: Bumping API and CLI package to use latest specs
-   Updated dependencies [65c7dc7]
    -   @gitbook/api@0.44.0

## 0.15.1

### Patch Changes

-   7d76dfb: Update integrations to use latest runtime and api client with `User-Agent`
-   Updated dependencies [46c9686]
    -   @gitbook/api@0.27.0

## 0.15.0

### Minor Changes

-   2dfce83: Bump CLI to use the latest OpenAPI spec

## 0.14.0

### Minor Changes

-   a5e0e14: Updates the CLI to check for Windows machines in order to install dependencies correctly

### Patch Changes

-   Updated dependencies [1c45194]
    -   @gitbook/api@0.16.0

## 0.13.1

### Patch Changes

-   28fb7f2: Validation method for target property in the manifest

## 0.13.0

### Minor Changes

-   5f9c5c9: - Bump API client to use the latest spec
    -   Update CLI to use the latest manifest with target support

### Patch Changes

-   Updated dependencies [5f9c5c9]
    -   @gitbook/api@0.11.0

## 0.12.0

### Minor Changes

-   6109681: Update CLI to support entities while publishing an integration

## 0.11.0

### Minor Changes

-   21891ed: Bump @gitbook/cli to use the latest API spec

## 0.10.0

### Minor Changes

-   Update CLI to include new scopes during the `init` command

## 0.9.1

### Patch Changes

-   e2972b9: Fix `gitbook new` script to generate correct (dev) deps
-   4f00cea: Destroy request during postinstall if there is a redirect

## 0.9.0

### Minor Changes

-   bd562ec: Update CLI template

## 0.8.0

### Minor Changes

-   3326853: Update init template

## 0.7.0

### Minor Changes

-   0b60654: Fix logic to match tunnel output using an updated pattern

## 0.6.0

### Minor Changes

-   62ec05b: Disable autoupdate of cloudflared binary

## 0.5.0

### Minor Changes

-   014e2e6: Suppress experimental warning in the CLI

## 0.4.0

### Minor Changes

-   ab8df1d: - Install deps for gitbook new command
    -   Create root folder when running gitbook new
    -   Bump cloudflared to 2023.4.0

## 0.3.0

### Minor Changes

-   87a1411: rebuild in dev mode in the watcher

## 0.2.0

### Minor Changes

-   0a17e3b: new command: gitbook dev

## 0.1.0

### Minor Changes

-   980fd90: Handle integration requests for v1 of the integration API
-   9dff6c5: Add Linear integration
-   6e144c5: Add command "gitbook unpublish" to remove an integration
-   4f6e234: Add CLI argument '--organization' or environment variable 'GITBOOK_ORGANIZATION' to override with which organization the publish command will run with
-   ce12efa: Publish custom blocks defined in the manifest

### Patch Changes

-   a1b68dd: Prioritize environment variable when setting configuration value
-   a2bba42: Interpolate environment variables in the manifest' secrets using \${{ env.SOMETHING }}
-   704ae2b: Added the Plausible and Fathom integrations.

    Also added some logic to load script with the `.raw.js` extension as text in the integrations. This should make sure
    that script injection is as seamless to develop as the other parts of teh integration by allowing us to write code
    in script file, then loading it as a script during the build process.

-   44d577c: Log the url of the newly published integration
-   a472e04: Warn about missing environment variables used in secrets
-   Updated dependencies [f0c07cb]
-   Updated dependencies [782d91b]
    -   @gitbook/api@null

## 0.0.1

### Patch Changes

-   d588454: Add support for publishing preview images and external links
