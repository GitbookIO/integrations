<p align="center">
  <img src="assets/gitbook_icon_dark.svg" alt="GitBook" width="48" />
</p>

<h1 align="center">GitBook Integration Platform</h1>

<p align="center">
  <a href="https://gitbook.com/docs"><img src="https://img.shields.io/static/v1?message=Documented%20on%20GitBook&logo=gitbook&logoColor=FAFAF9&label=%20&labelColor=1C1917&color=F25B3A"></a>
  <a href="/.github/CONTRIBUTING.md"><img src="https://img.shields.io/github/contributors/gitbookIO/integrations"/></a>
  <a href="https://github.com/gitbookIO/integrations/issues"><img src="https://img.shields.io/github/issues/gitbookIO/integrations"/></a>
</p>

<p align="center">Welcome to GitBook Integration Platform!</p>

This repository contains code, packages, and scripts related to the integrations platform in GitBook. Want to get started building your first integration? Head to our [documentation](https://developer.gitbook.com/getting-started/setup-guide) to get started.

## Documentation

Visit our [documentation](https://developer.gitbook.com/) to learn how to use
the GitBook Integration Platform with our API reference, getting started guides, and more.

> The documentation is hosted on GitBook and lives in this repository, within
> [`/docs`](./docs).

See a mistake or would like to help us with our documentation? Feel free to follow our [contributing guide](./.github/CONTRIBUTING.md) to open a pull request!

## Packages

Packages are the core of our integration platform, containing the code for the following:

- [`@gitbook/cli`](./packages/cli/): CLI to build and publish integrations for GitBook
- [`@gitbook/api`](./packages/api/): API client for GitBook
- [`@gitbook/runtime`](./packages/runtime/): Core library to easily write integrations

## Integrations

It also hosts the default integrations provided by the GitBook team, organized by category:

#### Analytics & Insights

| Integration                                         | Description                                                                    |
| --------------------------------------------------- | ------------------------------------------------------------------------------ |
| [Ahrefs](./integrations/ahrefs/)                    | Receive GitBook traffic insights directly in your Ahrefs dashboard.            |
| [Amplitude](./integrations/amplitude/)              | Track and identify GitBook page visitors with Amplitude analytics.             |
| [DevTune AI Traffic](./integrations/devtune/)       | Track AI bot crawlers and LLM referral traffic to your documentation.          |
| [Fathom](./integrations/fathom/)                    | Receive GitBook traffic insights directly in your Fathom dashboard.            |
| [Fullstory](./integrations/fullstory/)              | Capture user sessions in GitBook with Fullstory to understand reader behavior. |
| [Google Analytics](./integrations/googleanalytics/) | Receive GitBook traffic insights directly in your Google Analytics dashboard.  |
| [Heap](./integrations/heap/)                        | Plug your GitBook site to your Heap Analytics instance.                        |
| [Hotjar](./integrations/hotjar/)                    | Plug your GitBook site to your Hotjar installation.                            |
| [Koala](./integrations/koala/)                      | Receive GitBook traffic insights directly in your Koala dashboard.             |
| [Mixpanel](./integrations/mixpanel/)                | Plug your GitBook site to your Mixpanel account.                               |
| [Pendo](./integrations/pendo/)                      | Plug your GitBook site to your Pendo Analytics instance.                       |
| [Piwik PRO Analytics](./integrations/piwik/)        | Inject Piwik PRO Tag Manager into your published GitBook documentation site.   |
| [Plausible](./integrations/plausible/)              | Receive GitBook traffic insights directly in your Plausible dashboard.         |
| [PostHog](./integrations/posthog/)                  | Plug your GitBook site to your PostHog installation.                           |
| [Reo.dev](./integrations/reo/)                      | Plug your GitBook site to your Reo.dev installation.                           |
| [SalesViewer](./integrations/salesviewer/)          | Track and identify GitBook page visitors with SalesViewer analytics.           |
| [Segment](./integrations/segment/)                  | Integrate your GitBook public documentation with your Segment pipeline.        |
| [Toucan Toco](./integrations/toucantoco/)           | Embed Toucan's customer-facing analytics in your GitBook content.              |
| [Unify](./integrations/unify/)                      | Receive GitBook traffic insights directly in your Unify dashboard.             |
| [Wistia](./integrations/wistia/)                    | Add Wistia video analytics to your GitBook site.                               |
| [ZoomInfo](./integrations/zoominfo/)                | Plug your GitBook site to your ZoomInfo instance.                              |

#### Chat & Support

| Integration                                                      | Description                                                          |
| ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Crisp](./integrations/crisp/)                                   | Add the Crisp chat widget to your published GitBook content.         |
| [Freshdesk](./integrations/freshdesk/)                           | Add the Freshdesk chat widget to your published GitBook content.     |
| [Front](./integrations/front/)                                   | Add the Front chat widget to your published GitBook content.         |
| [HelpScout](./integrations/helpscout/)                           | Add the HelpScout chat widget to your published GitBook content.     |
| [Intercom](./integrations/intercom/)                             | Add the Intercom chat widget to your published GitBook content.      |
| [RunLLM](./integrations/runllm-widget/)                          | Add the RunLLM AI chat widget to your doc site.                      |
| [Salesforce Service Cloud Chat](./integrations/salesforce-chat/) | Add Salesforce Service Cloud Chat to your published GitBook content. |

#### Marketing & Growth

| Integration                                  | Description                                                                                    |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [Reflag](./integrations/bucket/)             | Sync your GitBook site's schema with Reflag to deliver adaptive experiences to users.          |
| [Formspree](./integrations/formspree/)       | Collect user signups directly in your published GitBook sites.                                 |
| [HubSpot](./integrations/hubspot/)           | Add the HubSpot tracking code to your published GitBook site.                                  |
| [Launchdarkly](./integrations/launchdarkly/) | Sync your GitBook site's schema with LaunchDarkly to deliver adaptive experiences to users.    |
| [Mailchimp](./integrations/mailchimp/)       | Grow your Mailchimp audiences, directly from your GitBook content.                             |
| [Marketo](./integrations/marketo/)           | Use Marketo's automation platform (part of the Adobe Experience Cloud) with your GitBook docs. |

#### Visitor Authentication

| Integration                            | Description                                                                               |
| -------------------------------------- | ----------------------------------------------------------------------------------------- |
| [AWS Cognito](./integrations/cognito/) | Control who has access to your published documentation with AWS Cognito.                  |
| [OIDC](./integrations/oidc/)           | Control who has access to your published documentation with your authentication provider. |
| [Auth0](./integrations/va-auth0/)      | Control who has access to your published documentation with Auth0.                        |
| [Azure](./integrations/va-azure/)      | Control who has access to your published documentation with Azure.                        |
| [Okta](./integrations/va-okta/)        | Control who has access to your published documentation with Okta.                         |

#### Content & Embeds

| Integration                                  | Description                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------------ |
| [Arcade](./integrations/arcade/)             | Embed interactive product demos in your documentation.                               |
| [Figma](./integrations/figma/)               | Embed Figma files and designs directly into GitBook pages.                           |
| [GitHub Files](./integrations/github-files/) | View GitHub files or permalinks into code blocks.                                    |
| [GitLab Files](./integrations/gitlab-files/) | View GitLab files or permalinks into code blocks.                                    |
| [Jira](./integrations/jira/)                 | Embed Jira issues directly in your GitBook documentation.                            |
| [Linear](./integrations/linear/)             | Embed Linear issues directly in your GitBook documentation.                          |
| [Lucid](./integrations/lucid/)               | Embed Lucid projects directly into GitBook.                                          |
| [Mermaid](./integrations/mermaid/)           | Build diagrams and visualizations using Markdown-inspired text definitions and code. |
| [PlantUML](./integrations/plantuml/)         | Build diagrams and visualizations using PlantUML.                                    |
| [RunKit](./integrations/runkit/)             | Embed interactive Node.js notebooks in your GitBook documentation.                   |
| [Sentry](./integrations/sentry/)             | Embed Sentry issues in your GitBook documentation.                                   |

#### Git Sync

| Integration                           | Description                                                                             |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| [GitHub Sync](./integrations/github/) | Synchronize your GitBook content with GitHub with GitBook's bi-directional integration. |
| [GitLab Sync](./integrations/gitlab/) | Synchronize your GitBook content with GitLab with GitBook's bi-directional integration. |

#### Collaboration & Notifications

| Integration                                      | Description                                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| [Discord](./integrations/discord/)               | Notify a server channel in Discord with real-time events from GitBook.               |
| [GitHub Copilot](./integrations/github-copilot/) | GitBook Copilot uses your documentation to provide instant answers in your workflow. |
| [Slack](./integrations/slack/)                   | Ask questions and get answers to your documentation, right in Slack.                 |
| [Webhook](./integrations/webhook/)               | Send GitBook events to your webhook endpoints.                                       |

#### Compliance

| Integration                                         | Description                                                            |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| [OneTrust Cookie Consent](./integrations/onetrust/) | Add the OneTrust cookie consent banner to your published GitBook site. |

## Contributing

Whether you're interested in contributing your own integration, helping out with our docs, or making updates to our packages—start by heading to our [contributing guide](./.github/CONTRIBUTING.md).

## Contributors

<a href="https://github.com/gitbookIO/integrations/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=gitbookIO/integrations" />
</a>

## Resources
- [GitBook Integrations Homepage](https://www.gitbook.com/integrations)
- [GitBook Integrations Docs](https://developer.gitbook.com/)
