# Webhook Integration

A webhook integration for GitBook that allows users to receive real-time notifications for selected events.

## Features

- **Real-time notifications:** Get notified instantly when selected events happen.
- **Flexible event selection:** Choose which events you want to receive.
- **Secure delivery:** HMAC signature verification ensures webhook authenticity.

## Setup

- Configure your webhook URL and select which events you want to receive
- Optional - but recommended - copy and verify the secret in your endpoint

## Example: Site View Event

```json
{
  "event": {
    "type": "site_view",
    "id": "evt_123456789",
    "space": {
      "id": "space_abc123",
      "title": "My Documentation"
    },
    "page": {
      "id": "page_def456",
      "title": "Getting Started",
      "path": "/getting-started"
    },
    "user": {
      "id": "user_789",
      "email": "user@example.com"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "installation": {
    "integration": "webhook",
    "installation": "install_123",
    "space": "space_abc123"
  }
}
```

All webhook requests include an `X-GitBook-Signature` header with an HMAC-SHA256 signature for verification.

## Supported Events

- **Site views** - When users visit pages on your site
- **Content updates** - When content in your space is modified
- **Page feedback** - When users provide feedback on pages

## Delivery and Retries

Webhook delivery is designed to be reliable:

- **Exponential backoff with jitter** – initial delay of 1 s, doubling each time (up to 3 retries) with a small random factor to prevent synchronized retries.
- **Automatic retry triggers** – network errors, timeouts, HTTP 5xx, and HTTP 429 (rate limiting).
- **At-least-once guarantee** – your endpoint may receive the same event multiple times. Make sure handlers are idempotent.

After three failed attempts no further retries occur.
