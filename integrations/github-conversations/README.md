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

## Permissions Required

- **Discussions**: Read access to repository discussions
- **Webhooks**: Write access to create and manage webhooks
- **Metadata**: Read access to repository information