# @gitbook/integration-osano

## 0.1.2

### Patch Changes

- 1e47315: Keep the Osano banner on screen on informational (timer) banners. Osano auto-accepts, saves and fires a dialog hide during initialization on those, which the integration mistook for a visitor decision and reloaded the page under the banner. Only consent saved after Osano reports initialized is forwarded to GitBook now.

## 0.1.1

### Patch Changes

- 6308e10: Stop the Osano banner from disappearing on its own. Osano saves a default consent during initialization in permissive mode, and forwarding it to GitBook reloaded the page under the banner before the visitor could respond, after which Osano never showed it again. Consent is now only forwarded once the visitor has closed the dialog or drawer.

## 0.1.0

### Minor Changes

- f076fce: Add Osano cookie consent integration.
