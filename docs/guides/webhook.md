# Receiving webhook notifications

The GitBook Webhook Integration allows you to receive real-time notifications when events occur in your GitBook spaces. This integration supports configurable webhook URLs, HMAC signature verification, and automatic retry logic with exponential backoff.

## Features

- **Real-time Event Delivery**: Receive instant notifications for space events
- **HMAC Signature Verification**: Secure webhook delivery with cryptographic verification
- **Automatic Retry Logic**: Built-in retry mechanism with exponential backoff for failed deliveries
- **Configurable Events**: Choose which events to receive (site views, content updates, page feedback)

## Supported Events

### Site View Events (`site_view`)
Triggered when a user visits a page on your GitBook site.

**Payload Example:**
```json
{
  "eventId": "evt_1234567890abcdef",
  "type": "site_view",
  "siteId": "site_abc123",
  "installationId": "inst_def456",
  "visitor": {
    "anonymousId": "anon_789ghi",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "ip": "192.168.1.100",
    "cookies": {
      "session_id": "sess_xyz789"
    }
  },
  "url": "https://docs.example.com/getting-started",
  "referrer": "https://www.google.com/search?q=example+docs"
}
```

### Content Updated Events (`space_content_updated`)
Triggered when content in a space is modified.

**Payload Example:**
```json
{
  "eventId": "evt_2345678901bcdefg",
  "type": "space_content_updated",
  "spaceId": "space_xyz789",
  "installationId": "inst_def456",
  "revisionId": "rev_abc123def456"
}
```

### Page Feedback Events (`page_feedback`)
Triggered when users provide feedback on pages.

**Payload Example:**
```json
{
  "eventId": "evt_3456789012cdefgh",
  "type": "page_feedback",
  "siteId": "site_abc123",
  "spaceId": "space_xyz789",
  "installationId": "inst_def456",
  "pageId": "page_feedback123",
  "feedback": {
    "rating": "good",
    "comment": "This page was very helpful!"
  },
  "visitor": {
    "anonymousId": "anon_789ghi",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "ip": "192.168.1.101",
    "cookies": {}
  },
  "url": "https://docs.example.com/api-reference",
  "referrer": "https://docs.example.com/getting-started"
}
```

## Configuration

### Required Settings

- **Webhook URL**: The endpoint where events will be sent
- **Secret**: A shared secret for HMAC signature verification
- **Event Types**: Select which events to receive

## Webhook Security

### HMAC Signature Verification

All webhook requests include an HMAC-SHA256 signature in the `X-GitBook-Signature` header for verification.

**Header Format:**
```
X-GitBook-Signature: t=1640995200,v1=abc123def456...
```

Where:
- `t`: Unix timestamp of the request
- `v1`: HMAC-SHA256 signature of the payload

### Signature Verification Example

#### Node.js
```javascript
const crypto = require('crypto');

function verifyGitBookSignature(payload, signature, secret) {
  if (!signature) return false;
  
  try {
    // Parse signature format: t=timestamp,v1=hash
    const parts = signature.split(',');
    let timestamp, hash;
    
    for (const part of parts) {
      if (part.startsWith('t=')) {
        timestamp = part.substring(2);
      } else if (part.startsWith('v1=')) {
        hash = part.substring(3);
      }
    }
    
    if (!timestamp || !hash) return false;
    
    // Generate expected signature (our implementation uses timestamp.payload format)
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${payload}`)
      .digest('hex');
    
    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    return false;
  }
}

// Usage
const isValid = verifyGitBookSignature(
  requestBody,
  request.headers['x-gitbook-signature'],
  'your-secret-key'
);
```


## Retry Logic

The integration includes automatic retry logic for failed webhook deliveries:

- **Max Retries**: 3 attempts
- **Backoff Strategy**: Exponential backoff with jitter
- **Base Delay**: 1 second
- **Jitter**: ±10% of base delay
- **Retry Conditions**: 
  - Network errors (timeouts, connection refused)
  - Server errors (5xx status codes)
  - Rate limiting (429 status codes)
- **No Retry**: Client errors (4xx except 429)

### Retry Schedule Example

| Attempt | Base Delay | Jitter Range | Total Delay Range | Schedule |
|---------|------------|--------------|-------------------|----------|
| 1       | 1s         | ±0.1s        | 1.0-1.1s          | 1s       |
| 2       | 2s         | ±0.2s        | 2.0-2.2s          | 2s       |
| 3       | 4s         | ±0.4s        | 4.0-4.4s          | 4s       |

## Error Handling

### HTTP Status Codes

- **200**: Success
- **400**: Bad Request (client error, no retry)
- **429**: Too Many Requests (rate limited, will retry)
- **500**: Internal Server Error (server error, will retry)

## Best Practices

### 1. Webhook Endpoint Design

```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

// Express.js example
app.post('/webhooks/gitbook', express.raw({type: 'application/json'}), (req, res) => {
  // Get raw body as string for signature verification
  const requestBody = req.body.toString();
  
  // Verify signature first
  const signature = req.headers['x-gitbook-signature'];
  const isValid = verifyGitBookSignature(requestBody, signature, process.env.GITBOOK_SECRET);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Parse and process event
  const event = JSON.parse(requestBody);
  
  switch (event.type) {
    case 'site_view':
      handleSiteView(event);
      break;
    case 'space_content_updated':
      handleContentUpdate(event);
      break;
    case 'page_feedback':
      handlePageFeedback(event);
      break;
  }
  
  res.status(200).json({ received: true });
});
```

### 2. Idempotency

Handle duplicate events gracefully:

```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

const processedEvents = new Set();

function handleEvent(event) {
  if (processedEvents.has(event.eventId)) {
    console.log('Duplicate event ignored:', event.eventId);
    return;
  }
  
  processedEvents.add(event.eventId);
  
  // Process event...
}
```

### 3. Async Processing

Process events asynchronously to respond quickly:

```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

app.post('/webhooks/gitbook', express.raw({type: 'application/json'}), (req, res) => {
  // Get raw body as string for signature verification
  const requestBody = req.body.toString();
  
  // Verify signature
  const signature = req.headers['x-gitbook-signature'];
  const isValid = verifyGitBookSignature(requestBody, signature, process.env.GITBOOK_SECRET);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Respond immediately
  res.status(200).json({ received: true });
  
  // Process asynchronously
  setImmediate(() => {
    const event = JSON.parse(requestBody);
    processEvent(event);
  });
});
```
