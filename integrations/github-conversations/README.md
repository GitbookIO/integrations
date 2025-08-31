# GitHub Conversations Integration

This integration connects GitHub Discussions to GitBook, allowing you to automatically ingest closed discussions for AI-powered documentation improvements.

## Features & setup

- **GitHub App Integration**: Full GitHub App with organization and repository-level permissions
- **Batch Ingestion**: Import all closed discussions on initial setup
- **Real-time Updates**: Webhook-based ingestion of newly closed discussions
- **Repository Selection**: Choose specific repositories or entire organizations

1. Install the integration from GitBook
2. Authorize with GitHub (will create a GitHub App installation)
3. Select the organization and repositories to monitor
4. The integration will automatically set up webhooks and ingest existing closed discussions

## Development - Creating a GitHub App

To set up this integration, you need to create a GitHub App with the following configuration:

### App Settings
- **GitHub App name**: `gitbook-github-conversations` (or your preferred name)
- **Homepage URL**: `https://www.example.com`
- **Setup URL**: `<your-integration-api-baser-url>/integrations/github-conversations/integration/setup`
- **Webhook URL**: `<your-integration-api-baser-url>/integrations/github-conversations/integration/webhook`
- **Webhook secret**: Set a secure secret for webhook validation

### Permissions Required
- **Repository permissions**:
  - **Discussions**: Read access to repository discussions
  - **Metadata**: Read access to repository information

### Webhook Events
Subscribe to these webhook events:
- **Discussion** events (for real-time ingestion when discussions are closed)

### After Creating the App
1. Note down the **App ID** and generate a **Private Key**
2. Generate a **Client Secret**
3. Set a **Webhook Secret** for security
4. Configure these environment variables baased on your GitHub App settings:

```bash
GITHUB_APP_ID=123456
GITHUB_APP_NAME=your-github-app-name
GITHUB_WEBHOOK_SECRET=your-secure-webhook-secret
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----"
GITHUB_CLIENT_ID=Iv23liXXXXXXXXXXXXXX
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Publish the app and you're ready to go.
