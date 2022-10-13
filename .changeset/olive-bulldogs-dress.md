---
'@gitbook/integration-fathom': patch
'@gitbook/integration-plausible': patch
'@gitbook/cli': patch
'@gitbook/eslint-config': patch
---

Added the Plausible and Fathom integrations.

Also added some logic to load script with the `.raw.js` extension as text in the integrations. This should make sure 
that script injection is as seamless to develop as the other parts of teh integration by allowing us to write code
in script file, then loading it as a script during the build process.
