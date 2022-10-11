# Slack integration

To configure it for your environment, create an application on Slack and use the `slack-manifest.yaml` file to configure it. Don't forget to update the URLs to natch your environment.


To publish it, run the command with the `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, and `SLACK_SIGNING_SECRET ` environment variables defined:

```
SLACK_CLIENT_ID=xxx SLACK_CLIENT_SECRET=xxxx SLACK_SIGNING_SECRET=xxxx npm run publish-integrations
```

