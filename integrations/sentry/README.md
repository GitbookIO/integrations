# Sentry integration

### How to test it?

1. Create a Sentry public integration at https://sentry.io/settings/<orgSlug>/developer-settings/new-public/
2. Set
   1. Webhook URL: https://integrations-gitbook-x-dev-<YOUR_INSTANCE>.firebaseapp.com/v1/integrations/sentry/integration/webhook
   2. Redirect URL: https://integrations-gitbook-x-dev-<YOUR_INSTANCE>.firebaseapp.com/v1/integrations/sentry/integration/redirect 
3. Publish the integration `SENTRY_CLIENT_ID=<client_id> SENTRY_CLIENT_SECRET=<client_secret> SENTRY_GITBOOK_INTEGRATION=<see-integratoin-url> gitbook publish .`
