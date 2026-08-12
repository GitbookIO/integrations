# Table of contents

* [Developer documentation](README.md)

## Build a custom component <a href="#integrations" id="integrations"></a>

* [Quickstart](integrations/quickstart.md)
* [Install the CLI](integrations/reference/README.md)
  * [CLI reference](integrations/reference/cli-reference.md)
* [Configure](integrations/configurations.md)
* [Develop](integrations/development/README.md)
  * [ContentKit](integrations/development/contentkit/README.md)
    * [Component reference](integrations/development/contentkit/reference.md)
  * [Integration runtime](integrations/development/runtime.md)
  * [Client library](integrations/development/client-library.md)
* [Publish your component](integrations/publishing.md)
* [Submit for review](integrations/submit-your-app-for-review.md)
* [Concepts](integrations/concepts.md)
* [Guides](integrations/guides/README.md)
  * [Create a custom unfurl action](integrations/guides/create-a-custom-unfurl-action-for-your-integration.md)
  * [Update text with a button](integrations/guides/interactivity.md)
  * [Receive webhook notifications](integrations/guides/webhook.md)
  * [Handle an HTTP request](integrations/guides/receiving-requests.md)
  * [Create an interactive text input](integrations/guides/create-an-interactive-text-input.md)
  * [Send data to a webframe](integrations/guides/send-data-to-a-webframe.md)
  * [Open a modal from a button](integrations/guides/open-a-modal-from-a-button.md)
  * [Save editable block content](integrations/guides/save-editable-block-content.md)
  * [Reference your component in markown](integrations/guides/markdown.md)

## GitBook API

* [Quickstart](gitbook-api/quickstart.md)
* [API reference](gitbook-api/api-reference/README.md)
  * ```yaml
    props:
      models: false
      downloadLink: true
      grouping: by-operation
    type: builtin:openapi
    dependencies:
      spec:
        ref:
          kind: openapi
          spec: gitbook
    ```
* [Authentication](gitbook-api/authentication.md)
* [Rate limiting](gitbook-api/rate-limiting.md)
* [Pagination](gitbook-api/pagination.md)
* [Errors](gitbook-api/errors.md)
* [Concepts](gitbook-api/concepts.md)
* [Find your IDs](gitbook-api/find-your-ids.md)
* [Guides](gitbook-api/guides/README.md)
  * [Pull analytics from your site](gitbook-api/guides/pull-analytics-from-your-site.md)
  * [Work on your site with an AI agent](gitbook-api/guides/work-on-your-site-with-an-ai-agent.md)
  * [Manage your team with the API](gitbook-api/guides/manage-your-team-with-the-api.md)
  * [Track advanced analytics with GitBook's Events Aggregation API](https://gitbook.com/docs/guides/docs-analytics/track-advanced-analytics-with-gitbooks-events-aggregation-api)

## Resources

* [ContentKit playground](https://app.gitbook.com/dev/contentkit/)
* [GitHub examples](https://github.com/GitbookIO/integrations)
