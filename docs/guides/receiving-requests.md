# Working with HTTP requests

Integrations communicate with the outside world over HTTP. Your integration can receive HTTP requests from the outside callers, such as webhooks or callback URLs, and it can also receive events from the GitBook platform.

{% hint style="info" %}
Most integrations will not need to deal with this low-level API, our framework takes care of that for you.
{% endhint %}

Your integration provides an API to the outside world like so:

```
POST /{version}
Content-Type: multipart/form-data

Body (FormData)
    - event
    - environment
    - fetch-body
```

### Version

The URL of the request contains the version of the API. Your integration is expected to be backwards compatible with previous (non-deprecated) versions of the API. If you're using GitBook's CLI to create your integration, we manage the backwards compatibility for you.

### Body

Requests contain a `FormData` body with 3 properties:

* `event` contains the event, and is of typing `Event` from `@gitbook/api-client`
* `environment` contains the environment of this execution
* `fetch-body` contains the raw buffer of the body sent with the request (if one exists)
