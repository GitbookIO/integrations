---
icon: block-brick-fire
---

# Rate limiting

Different types of API methods are subject to different rate limits.

The response's HTTP headers are the authoritative source for the current number of API calls available to you or your app at any given time. The returned HTTP headers of any API request show your current rate limit status, as described below.

| Header Name             | Description                                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `X-RateLimit-Limit`     | The maximum number of requests you're permitted to make in the current rate limit window.                              |
| `X-RateLimit-Remaining` | The number of requests remaining in the current rate limit window.                                                     |
| `X-RateLimit-Reset`     | The time at which the current rate limit window resets in [UTC epoch seconds](http://en.wikipedia.org/wiki/Unix_time). |

If you exceed the rate limit, an API error response is returned:

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
