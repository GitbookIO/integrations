# Webhook Integration

A webhook integration for GitBook that allows users to receive real-time notifications for actionable events in their spaces.

## Features

- **Actionable Events**: Receive notifications for meaningful events like content updates, visibility changes, and user feedback
- **Flexible Configuration**: Set webhook URL and select which events to receive
- **Reliable Delivery**: Built-in retry logic and error handling
- **Secure**: HMAC signature verification for webhook authenticity

## Configuration

Users can configure:
- Webhook URL (required)
- Event selection (choose which events to receive)
- Webhook secret (auto-generated for HMAC verification)

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

