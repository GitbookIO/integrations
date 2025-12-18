# Fireflies Conversations Integration

This integration allows GitBook to ingest meeting transcripts from Fireflies to provide AI-suggested improvements to your documentation.

## Features

- **Bulk Transcript Import**: When first installed, the integration fetches recent transcripts from Fireflies (last 30 days)
- **Real-time Webhook Ingestion**: Automatically ingests transcripts when transcription completes via webhooks
- **Automatic Conversion**: Converts Fireflies transcripts into GitBook conversations format for analysis

## Setup

1. Install the integration in your GitBook organization
2. Enter your Fireflies API key in the integration settings
3. The integration will automatically start ingesting transcripts from the last 30 days

## Webhook Setup (Optional)

To enable real-time transcript ingestion when transcription completes:

1. **Configure Webhook Secret**:
   - In the GitBook integration settings, enter your Fireflies webhook secret
   - You can find or generate this in your Fireflies dashboard: Settings → Developer Settings
   - The webhook secret is used to verify that webhook requests are authentic

2. **Configure Webhook URL in Fireflies**:
   - Visit [Fireflies.ai dashboard settings](https://app.fireflies.ai/settings)
   - Navigate to the Developer settings tab
   - Enter your webhook URL: `https://[your-integration-endpoint]/webhook`
   - The webhook URL can be found in your GitBook integration settings
   - Save the webhook URL

3. **Test the Webhook**:
   - Upload an audio file through the Fireflies dashboard at [app.fireflies.ai/upload](https://app.fireflies.ai/upload)
   - Once transcription completes, the webhook should trigger and the transcript will be automatically ingested into GitBook

**Note**: Webhooks are only fired for meetings that you own (the `organizer_email`). For team-wide webhooks, you need the Enterprise tier with Super Admin role.

## Getting Your Fireflies API Key

1. Log in to your Fireflies account
2. Navigate to Settings → Integrations → API
3. Generate or copy your API key
4. Paste the API key into the GitBook integration configuration

## Development

To develop and test this integration, you'll need a Fireflies API key:

### 1. Get a Fireflies API Key

1. Go to [Fireflies](https://fireflies.ai/) and log in to your account
2. Navigate to Settings → Integrations → API
3. Generate an API key if you don't have one

### 2. Testing

The integration uses the Fireflies GraphQL API to fetch transcripts. You can test the integration by:

1. Setting up the integration with your API key
2. Verifying that transcripts are fetched and converted to GitBook conversations
3. Checking that the conversation parts are properly formatted with speaker information

### 3. Webhook Testing

To test webhook functionality:

1. Set up the integration with your API key and webhook secret
2. Configure the webhook URL in your Fireflies dashboard
3. Upload an audio file or wait for a meeting to be transcribed
4. Verify that the transcript is automatically ingested when transcription completes

### 4. API Documentation

For more information about the Fireflies APIs, see:
- [Fireflies GraphQL API Documentation](https://docs.fireflies.ai/graphql-api/query/transcripts)
- [Fireflies Webhooks Documentation](https://docs.fireflies.ai/graphql-api/webhooks)

