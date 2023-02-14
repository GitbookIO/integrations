# @gitbook/cli

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
