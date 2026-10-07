# GitHub Conversations Integration

This integration ingests resolved or closed GitHub Discussions into GitBook.

## Setup Instructions for development

1. Create a GitHub OAuth application.
2. Set `https://<integration-domain>/v1/integrations/github-conversations/integration/oauth` as the redirect URL.
3. Configure a webhook on your repository for the `discussion` event with `https://<integration-domain>/v1/integrations/github-conversations/integration/webhook` as the URL.
