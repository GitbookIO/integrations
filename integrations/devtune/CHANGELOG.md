# DevTune AI Traffic - GitBook Integration

## 0.1.1

### Patch Changes

- 16c96f1: Rebuild all built-in integrations with the updated runtime’s support for recoverable errors and safe handling of integration authentication failures.

## 0.1.0

- Initial release
- Track AI bot crawlers and LLM referral traffic on GitBook-hosted documentation
- SPA navigation support (pushState/popstate) for GitBook's client-side routing
- Lightweight ~1KB beacon using navigator.sendBeacon()
- No cookies, no PII — only page metadata and user agent transmitted
- XHR fallback for browsers without sendBeacon support
- Prerender-aware: waits for page visibility before tracking
