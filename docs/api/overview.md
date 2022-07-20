# Overview

{% hint style="warning" %}
The GitBook API is currently in **beta**. This means you should not rely on it's availability, and that it may change without prior warning.
{% endhint %}

This section describes how to use the GitBook API and its resources. If you have any questions or issues, please contact the [GitBook Support](mailto:support@gitbook.com).

## API Endpoint

The GitBook API can be accessed using the `api.gitbook.com` hostname:

```bash
curl https://api.gitbook.com/v1/
{"version":"10.9.128","build":"2022-07-19T13:00:05.548Z"}
```

## Authentication & Rate Limiting

|                                                                                                                                                           |                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| <p><strong></strong><a href="authentication.md"><strong>Authentication</strong></a><br>Create an API access token and authenticate your API requests.</p> | <p><strong></strong><a href="rate-limiting.md"><strong>Rate Limiting</strong></a><br>Understand how API requests are rate limited.</p> |

## Errors & Pagination

|                                                                                                                                                   |                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| <p><strong></strong><a href="errors.md"><strong>Errors</strong></a><br>Learn about API errors, how they're structured and how to handle them.</p> | <p><strong></strong><a href="pagination.md"><strong>Pagination</strong></a><br>Paginate through API List results.</p> |
