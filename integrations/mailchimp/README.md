# Getting Started

1. Create [an app on Mailchimp](https://us9.admin.mailchimp.com/account/oauth2/)
2. The Redirect URI should be: https://integrations-getsquad-dev-steven.firebaseapp.com/v1/integrations/mailchimp/integration/oauth (replace with your name)
3. Note the Client ID and Client Secret
4. Deploy with:

```
cd integrations/mailchimp
MAILCHIMP_CLIENT_ID=CLIENT_ID MAILCHIMP_CLIENT_SECRET=CLIENT_SECRET gitbook publish .
```