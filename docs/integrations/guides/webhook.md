---
description: Learn how to receive webhook notifications through GitBook’s integration
---

# Receive webhook notifications

The [Webhook integration](https://www.gitbook.com/integrations/webhook) allows you to receive real-time notifications when events occur in your GitBook spaces. This integration supports configurable webhook URL, HMAC signature verification, and automatic retry logic with exponential backoff.

### Features

* **Real-time event delivery**: Receive instant notifications for selected events
* **HMAC signature verification**: Secure webhook delivery with cryptographic verification
* **Automatic retry logic**: Built-in retry mechanism with exponential backoff for failed deliveries
* **Configurable events**: Choose which events to receive (site views, content updates, page feedback)

### Getting started

Before following the rest of the guide, make sure the [Webhook integration](https://www.gitbook.com/integrations/webhook) is installed into your organization.&#x20;

### Supported events

The webhook integration can be installed either in spaces or in sites. The list of events you can select depends on where the integration is installed.

For spaces:

* **Content updates** - When content in your space is modified

For sites:

* **Site views** - When users visit pages on your site
* **Page feedback** - When users provide feedback on pages

#### Content updated events (`space_content_updated`)

Triggered when content in a space is modified.

**Payload example:**

```json
{
  "eventId": "evt_2345678901bcdefg",
  "type": "space_content_updated",
  "spaceId": "space_xyz789",
  "installationId": "inst_def456",
  "revisionId": "rev_abc123def456"
}
```

#### Site view events (`site_view`)

Triggered when a user visits a page on your GitBook site.

**Payload example:**

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

#### Page feedback events (`page_feedback`)

Triggered when users provide feedback on pages.

**Payload example:**

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

### Configuration

#### Required settings

* **Webhook URL**: The endpoint where events will be sent
* **Event types**: Select which events to receive

### Webhook security

#### HMAC signature verification

All webhook requests include an HMAC-SHA256 signature in the `X-GitBook-Signature` header for verification.

**Header format:**

```
X-GitBook-Signature: t=1640995200,v1=abc123def456...
```

Where:

* `t`: Unix timestamp of the request
* `v1`: HMAC-SHA256 signature of the payload

#### Signature verification example

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

### Retry logic

The integration includes automatic retry logic for failed webhook deliveries:

* **Max retries**: 3 attempts
* **Backoff strategy**: Exponential backoff with jitter
* **Base delay**: 1 second
* **Jitter**: ±10% of base delay
* **Retry conditions**:
  * Network errors (timeouts, connection refused)
  * Server errors (5xx status codes)
  * Rate limiting (429 status codes)
* **No retry**: Client errors (4xx except 429)

#### Retry schedule example

| Attempt | Base delay | Jitter range | Total delay range | Schedule |
| ------- | ---------- | ------------ | ----------------- | -------- |
| 1       | 1s         | ±0.1s        | 1.0-1.1s          | 1s       |
| 2       | 2s         | ±0.2s        | 2.0-2.2s          | 2s       |
| 3       | 4s         | ±0.4s        | 4.0-4.4s          | 4s       |

### Error handling

#### HTTP status codes

* **200**: Success
* **400**: Bad Request (client error, no retry)
* **429**: Too Many Requests (rate limited, will retry)
* **500**: Internal Server Error (server error, will retry)

### Best practices

#### 1. Webhook endpoint design

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

#### 2. Idempotency

Handle duplicate events gracefully:

```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

const processedEvents = new Map();
const EVENT_RETENTION_MS = 2 * 60 * 1000; // 2 minutes

function remember(eventId) {
  if (processedEvents.has(eventId)) return false;

  // Insert and schedule automatic eviction
  const timer = setTimeout(() => {
    processedEvents.delete(eventId);
  }, EVENT_RETENTION_MS);

  processedEvents.set(eventId, timer);
  return true;
}

function handleEvent(event) {
  // Guard goes first so concurrent deliveries don’t double-process
  if (!remember(event.eventId)) {
    console.log('Duplicate event ignored:', event.eventId);
    return;
  }

  // Process event...
  // doWork(event);

  // If processing fails and you want to allow a retry, you can undo the remember:
  // clearTimeout(processedEvents.get(event.eventId));
  // processedEvents.delete(event.eventId);
}
```

#### 3. Async processing

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
