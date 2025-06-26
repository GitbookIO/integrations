# Intercom Conversations Integration

This integration allows the users to ingest closed support conversations from Intercom into GitBook.

## Setup Instructions for development

1. Create an Intercom OAuth application at https://app.intercom.com/a/apps/_/developer-hub
2. Set `https://<integration-domain>/v1/integrations/intercom-conversations/integration/oauth` as the redirect URL
3. Get the client ID and secret
   It is recommended to store them in 1Password
4. Set `https://<integration-domain>/v1/integrations/intercom-conversations/integration/webhook` as the webhook URL
   1. Go to https://app.intercom.com/a/apps/_/developer-hub/webhooks
   2. Create a new webhook
   3. Set the webhook URL to `https://<integration-domain>/v1/integrations/intercom-conversations/integration/webhook`
   4. Select the "Conversation closed" event type
   5. Save the webhook
