# HubSpot Conversations Integration

This integration allows GitBook to ingest support conversations from HubSpot to provide AI-suggested improvements to your documentation.

## Features

- **Bulk Conversation Import**: When first installed, the integration fetches recent closed conversations from HubSpot
- **Real-time Updates**: Receives webhook notifications when conversations are closed and ingests them automatically

## Setup

1. Install the integration in your GitBook organization
2. Click "Authorize" to connect your HubSpot account
3. The integration will automatically start ingesting closed conversations


## Development

To develop and test this integration, you'll need to create a HubSpot public app with the following configuration:

### 1. Create a HubSpot Public App

1. Go to the [HubSpot Developer Portal](https://developers.hubspot.com/) - create a developer account if you don't have one
2. Navigate to "Apps" and click "Create app"
3. Fill in your app details (name, description, etc.), e.g "GitBook Conversations Integration - <your-env>"

### 2. Configure OAuth Scopes

In your HubSpot app settings, add the following OAuth scopes:
- `oauth` - Required for OAuth authentication flow
- `conversations.read` - Required to read conversation data from HubSpot

### 3. Set Up Webhook Subscription

Configure a webhook subscription for conversation property changes:

1. In your HubSpot app, go to the "Webhooks" section
2. Add a new webhook subscription with:
   - **Subscription Type**: `conversation.propertyChange`
   - **Webhook URL**: `https://<your-integration-env>/v1/integrations/hubspot-conversations/integration/webhook`
   - **Property**: `status` (the integration listens for status changes to "CLOSED")

### 4. Environment Variables

Set the following environment variables in your development environment:
- `HUBSPOT_CLIENT_ID` - Your HubSpot app's client ID
- `HUBSPOT_CLIENT_SECRET` - Your HubSpot app's client secret

