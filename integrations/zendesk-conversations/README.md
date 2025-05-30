# Zendesk integration

### How to test it?

1. Create a Zendesk OAuth application at https://d3v-gitbook.zendesk.com/admin/apps-integrations/apis/zendesk-api/oauth_clients/new
2. Set `https://<integration-domain>>/v1/integrations/zendesk-conversations/integration/oauth` as redirect URL
3. Get the client ID and secret
   It is recommended to store them in 1Password
3. Edit the `.env` file to define `ZENDESK_CLIENT_ID` and `ZENDESK_CLIENT_SECRET`
