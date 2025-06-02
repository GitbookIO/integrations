# Intercom Conversations Integration

This integration allows you to ingest closed support conversations from Intercom into GitBook Docs Conversations.

## Setup Instructions

1. Create an Intercom OAuth application at https://app.intercom.com/a/apps/_/developer-hub
2. Set `https://<integration-domain>/v1/integrations/intercom-conversations/integration/oauth` as the redirect URL
3. Get the client ID and secret
   It is recommended to store them in 1Password
4. Edit the `.env` file to define `INTERCOM_CLIENT_ID` and `INTERCOM_CLIENT_SECRET`

## Webhook Configuration

Unlike other integrations, Intercom webhooks need to be configured through their UI:

1. Go to https://app.intercom.com/a/apps/_/developer-hub/webhooks
2. Create a new webhook
3. Set the webhook URL to `https://<integration-domain>/v1/integrations/intercom-conversations/integration/webhook`
4. Select the "Conversation closed" event type
5. Save the webhook

## Features

- Ingests closed support conversations from Intercom
- Preserves conversation history and metadata
- Supports both user and team member messages
- Automatically ingests conversations from the last 30 days upon installation
- Real-time ingestion of newly closed conversations via webhooks 