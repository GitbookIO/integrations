# GitHub Conversations Integration

This integration connects GitHub Discussions to GitBook, allowing you to automatically ingest closed discussions for AI-powered documentation improvements.

## Features

- **GitHub App Integration**: Full GitHub App with organization and repository-level permissions
- **Batch Ingestion**: Import all closed discussions on initial setup
- **Real-time Updates**: Webhook-based ingestion of newly closed discussions
- **Repository Selection**: Choose specific repositories or entire organizations
- **Automatic Webhook Management**: Programmatically manage webhooks for selected repositories

## Setup

1. Install the integration from GitBook
2. Authorize with GitHub (will create a GitHub App installation)
3. Select the organization and repositories to monitor
4. The integration will automatically set up webhooks and ingest existing closed discussions

## How it Works

The integration uses GitHub's GraphQL API to query discussions and REST API webhooks to receive real-time updates when discussions are closed. It converts GitHub discussions into GitBook conversation format for AI analysis.

## Creating a GitHub App

To set up this integration, you need to create a GitHub App with the following configuration:

### App Settings
- **GitHub App name**: `gitbook-github-conversations` (or your preferred name)
- **Homepage URL**: `https://www.gitbook.com`
- **User authorization callback URL**: `https://api.gitbook.com/v1/integrations/github-conversations/oauth`
- **Setup URL**: `https://api.gitbook.com/v1/integrations/github-conversations/setup`
- **Webhook URL**: `https://api.gitbook.com/v1/integrations/github-conversations/webhook`

### Permissions Required
- **Repository permissions**:
  - **Discussions**: Read access to repository discussions
  - **Webhooks**: Write access to create and manage webhooks
  - **Metadata**: Read access to repository information

### Webhook Events
Subscribe to these webhook events:
- **Discussion** events (for real-time ingestion when discussions are closed)
- **Installation** events (to handle app installation and removal)

### After Creating the App
1. Note down the **App ID** and generate a **Private Key**
2. Generate a **Client Secret**
3. Set a **Webhook Secret** for security
4. Configure these secrets in your GitBook integration environment variables:
   - `GITHUB_APP_ID`
   - `GITHUB_PRIVATE_KEY`
   - `CLIENT_ID`
   - `CLIENT_SECRET`
   - `WEBHOOK_SECRET`