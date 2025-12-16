# Fireflies Conversations Integration

This integration allows GitBook to ingest meeting transcripts from Fireflies to provide AI-suggested improvements to your documentation.

## Features

- **Bulk Transcript Import**: When first installed, the integration fetches recent transcripts from Fireflies (last 30 days)
- **Automatic Conversion**: Converts Fireflies transcripts into GitBook conversations format for analysis

## Setup

1. Install the integration in your GitBook organization
2. Enter your Fireflies API key in the integration settings
3. The integration will automatically start ingesting transcripts from the last 30 days

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

### 3. API Documentation

For more information about the Fireflies GraphQL API, see:
- [Fireflies GraphQL API Documentation](https://docs.fireflies.ai/graphql-api/query/transcripts)

