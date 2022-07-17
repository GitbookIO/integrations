# Slack integration

To configure it for your environment, create an application on Slack and use the `slack-manifrst.yaml` file to configure it. Don't forget to update the URLs to natch your environment.


To publish it, run the command with the `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET` environment variables defined:

```
SLACK_CLIENT_SECRET=xxx SLACK_CLIENT_SECRET=xxxx npm run publish-integrations
```

