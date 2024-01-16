# Publishing this Integration

## Prerequisites
1. Make sure you've [setup this repository and authenticated](https://app.gitbook.com/o/d8f63b60-89ae-11e7-8574-5927d48c4877/s/-MG7r2HeK94SceWjMDdW/development/integrations/working-with-integrations) with the `gitbook` CLI properly.
2. Once that is done, ensure that you have a GitHub App [configured and published](https://app.gitbook.com/o/d8f63b60-89ae-11e7-8574-5927d48c4877/s/-MG7r2HeK94SceWjMDdW/development/configuration#github) correctly.

### Publishing
Go to the integration folder at `cd integrations/github`. Before you run `publish` you must set a bunch of environment variables that are defined in the `manifest` file. In order to do that, open your GitHub App settings at https://github.com/settings/apps and then do the following

- `export GITHUB_APP_INSTALL_URL=https://github.com/apps/your-app-name/installations/new` , and replace `your-app-name` with whatever is the name of your app currently in the settings page URL.
- `export GITHUB_APP_ID=app-id-from-settings`
- `export GITHUB_CLIENT_ID=client-id-from-settings`
- `export GITHUB_CLIENT_SECRET=client-secret-that-you-noted-down-earlier`
- `export GITHUB_WEBHOOK_SECRET=webhook-secret-that-you-noted-down-earlier`
- ```export GITHUB_PRIVATE_KEY=`cat ~/Downloads/gitbook-dev-YOURNAME.key```
(this is the file that we converted from `.pem` to `.key` earlier. Make sure the file exists at the path)

Once you've exported these `env` variables, it's time to run the `publish` script:

`gitbook publish --organization orgId` where `orgId` will be the ID of your personal organization in your dev environment under which this integration should be published.
