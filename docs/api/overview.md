# Overview

{% content-ref url="references/" %}
[references](references/)
{% endcontent-ref %}

{% content-ref url="librairies/" %}
[librairies](librairies/)
{% endcontent-ref %}

## Endpoint

The GitBook rest API can be accessed using the `api.gitbook.com` hostname.

## Authentication

There is currently one way to authenticate with GitBook API v1: by providing an authentication token. A token can be created in your GitBook user account settings.

This token can then be provided in the Authorization header of your HTTP request.

```bash
curl -H "Authorization: Bearer [YOUR_TOKEN]" https://$HOSTNAME/v1/user
```



## Pagination

Some methods return paginated results. The formatting of a paginated result is always:

```json
{
    "items": [
        ...
    ],
    "next": {
        "page": "..."
    },
    "previous": {
        "page": "..."
    }
}
```

The objects `previous` and `next` will be omitted if there are no previous or next items respectively.

The `next.page` and `previous.page` values can be added to the query parameters of the original query under the `page` key in order to get the next or previous page.

#### Example

You make a GET request to a paginated endpoint `https://api.example.com/foo/bar`, and receive the following response

```json
{
  "items": [],
  "next": {
    "page": "next-page-id"
  }
}
```

In order to get the next page of results, you would take the ID at position `.next.page` in the response body, and provide it as the value of the `page` key in a query to the same endpoint. The full URL including query parameters of your request to get the next page of the listing is:

```
https://api.example.com/foo/bar?page=next-page-id
```

## Errors

GitBook uses conventional HTTP response codes to indicate the success or failure of an API request.

As a general rule:

* Codes in the `2xx` range indicate success
* Codes in the `4xx` range indicate incorrect or incomplete parameters (e.g. a required parameter was omitted, or an operation failed with a 3rd party, etc.)
* Codes in the `5xx` range indicate an error with GitBook's servers.

GitBook also outputs an error message and an error code formatted in JSON:

```json
{
    "error": {
        "code": 404,
        "message": "Page not found in this space"
    }
}
```

## Rate limiting

Different types of API methods on GitBook.com are subject to different rate limits.

The response's HTTP headers are the authoritative source for the current number of API calls available to you or your app at any given time. The returned HTTP headers of any API request show your current rate limit status, as described below.

| Header Name             | Description                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `X-RateLimit-Limit`     | The maximum number of requests you're permitted to make in the current rate limit window.                               |
| `X-RateLimit-Remaining` | The number of requests remaining in the current rate limit window.                                                      |
| `X-RateLimit-Reset`     | The time at which the current rate limit window resets in [UTC epoch seconds](http://en.wikipedia.org/wiki/Unix\_time). |

If you exceed the rate limit, an error response returns:

```shell
> HTTP/2 429
> X-RateLimit-Limit: 60
> X-RateLimit-Remaining: 0
> X-RateLimit-Reset: 1377013266

> {
>    "error": {
>        "code": 429
>        "message": "API rate limit exceeded. Please try again in 60 seconds"
>    }
> }
```
