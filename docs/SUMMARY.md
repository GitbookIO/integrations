# Table of contents

* [Developer documentation](README.md)

## Build an integration <a href="#integrations" id="integrations"></a>

* [Quickstart](integrations/quickstart.md)
* [Install the CLI](integrations/reference/README.md)
  * [CLI reference](integrations/reference/cli-reference.md)
* [Configure your integration](integrations/configurations.md)
* [Develop your integration](integrations/development/README.md)
  * [ContentKit](integrations/development/contentkit/README.md)
    * [Component reference](integrations/development/contentkit/reference.md)
    * [Markdown](integrations/development/contentkit/markdown.md)
  * [Integration runtime](integrations/development/runtime.md)
  * [Client library](integrations/development/client-library/README.md)
    * [GitBook methods](integrations/development/client-library/gitbook-methods.md)
* [Publish your integration](integrations/publishing.md)
* [Submit your integration for review](integrations/submit-your-app-for-review.md)
* [Concepts](integrations/concepts.md)
* [Guides](integrations/guides/README.md)
  * [Create a custom unfurl action](integrations/guides/create-a-custom-unfurl-action-for-your-integration.md)
  * [Create interactive blocks](integrations/guides/interactivity.md)
  * [Receive webhook notifications](integrations/guides/webhook.md)
  * [Work with HTTP requests](integrations/guides/receiving-requests.md)

## GitBook API

* [Quickstart](gitbook-api/quickstart.md)
* [API reference](gitbook-api/api-reference/README.md)
  * ```yaml
    props:
      models: false
      downloadLink: true
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
* [Guides](gitbook-api/guides/README.md)
  * [Track advanced analytics with GitBook's Events Aggregation API](https://gitbook.com/docs/guides/docs-analytics/track-advanced-analytics-with-gitbooks-events-aggregation-api)

## Resources

* [ContentKit playground](https://app.gitbook.com/dev/contentkit/)
* [GitHub examples](https://github.com/GitbookIO/integrations)
