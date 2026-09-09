---
'@gitbook/integration-osano': patch
---

Keep the Osano banner on screen on informational (timer) banners. Osano auto-accepts, saves and fires a dialog hide during initialization on those, which the integration mistook for a visitor decision and reloaded the page under the banner. Only consent saved after Osano reports initialized is forwarded to GitBook now.
