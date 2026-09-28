---
'@gitbook/integration-posthog': patch
---

Capture pageviews on client-side navigation. The script called `posthog.init` without `capture_pageview`, so posthog-js applied the legacy `capture_pageview: true`, which captures a single `$pageview` per full page load and never enables history monitoring. Since GitBook sites navigate via `pushState`, every subsequent in-site navigation went untracked. Setting `capture_pageview: 'history_change'` enables the `HistoryAutocapture` extension, matching the SPA handling the Google Analytics integration already does.
