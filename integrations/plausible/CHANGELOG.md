# @gitbook/integration-plausible

## 0.1.0

### Minor Changes

-   76266f0: Add self-hosting option to the Plausible integration

### Patch Changes

-   617f5aa: Update the CSP for Fathom and Plausible
-   a66c319: Directly server Plausible JS logic to avoid fetching another script and better handle adblockers
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
