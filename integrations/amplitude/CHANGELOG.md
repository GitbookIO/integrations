# @gitbook/integration-amplitude

## 2.2.0

### Minor Changes

- 88fe16b: Support Amplitude projects with EU data residency: a new "Server Region" option loads the SDK from the EU CDN and routes events to the EU endpoint. Previously the injected loader always used the US CDN, which rejects EU API keys with 401 "Invalid Key.", so the integration silently never initialized for EU projects.

## 2.1.0

### Minor Changes

- a09e3b5: Add more configuration options to amplitude integration

## 2.0.0

### Major Changes

- 3cd432a: Add amplitude integration
