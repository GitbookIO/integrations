# Webhook Integration

A webhook integration for GitBook that allows users to receive real-time notifications for actionable events.

## Features

- **Real-time notifications:** Get notified instantly when actionable events happen.
- **Flexible event selection:** Choose which events you want to receive.
- **Secure delivery:** HMAC signature verification ensures webhook authenticity.

## Configuration

Users can configure:
- Webhook URL (required)
- Event selection (choose which events to receive)

## Webhook Payload Format

Each webhook request includes:

```json
{
  "event_type": "space_content_updated",
  "event_data": { /* Original GitBook event data */ },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "installation": {
    "integration": "webhook",
    "installation": "install_123",
    "space": "space_456"
  }
}
```

If a webhook secret is configured, the request will include an `X-GitBook-Signature` header with an HMAC-SHA256 signature.

## Supported Events

- `space_content_updated` - When content in a space is updated
- `space_visibility_updated` - When space visibility or access permissions change
- `page_feedback` - When users provide feedback on pages

