# Intercom Conversations Integration

This integration allows the users to ingest closed support conversations from Intercom into GitBook.

## Setup Instructions for development

### 1. Create an Intercom App

1. Go to https://app.intercom.com/a/apps/_/developer-hub
2. Click "New app" 
3. Choose "Build an app"
4. Name your app: `GitBook (Dev <your-name>)` (replace `<your-name>` with your actual name)
5. Select your workspace
6. Click "Create app"

### 2. Configure OAuth

1. In your newly created app, go to the "Authentication" section
2. Enable OAuth by toggling it on
3. Set the redirect URL to: `https://<integration-domain>/v1/integrations/intercom-conversations/integration/oauth`
4. Note down your Client ID and Client Secret (store them securely in 1Password)

### 3. Set Permissions

1. Go to the "Permissions" section
2. Request the following scopes:
   - `Read conversations`
   - `List and view all admins` 
   - `Read tickets`

### 4. Configure Webhook

1. Go to the "Webhooks" section
2. Click "Create webhook"
3. Set the webhook URL to: `https://<integration-domain>/v1/integrations/intercom-conversations/integration/webhook`
4. Under "Topics", select: `conversation.admin.closed`
5. Click "Save webhook"

### 5. Note on App Usage

You'll only be able to install the app in workspaces where you are a member if the app is not public.
