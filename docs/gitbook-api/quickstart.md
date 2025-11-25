---
description: Learn how to use the GitBook API within minutes
icon: bolt
---

# Quickstart

The GitBook API allows you to read and write information across the spaces and pages you have access to in GitBook.

You can use the GitBook API to:

* Create, update, and delete [organizations](broken-reference), [spaces](broken-reference), [collections](broken-reference), and [published docs sites](broken-reference)
* [Manage users, teams, and access permissions](broken-reference) at both the space and organization level
* [Import and export content](broken-reference) (pages, files, and reusable content)
* [Create, list, review, merge, and update change requests](broken-reference)
* [Post, retrieve, update, and delete comments](broken-reference) (and comment replies)
* [Configure custom hostnames](broken-reference), URLs, and search settings
* [Monitor content performance](broken-reference) with analytics endpoints
* [Manage integrations](broken-reference) and OpenAPI documentation

…and much more, all via simple REST calls.

{% stepper %}
{% step %}
### Getting started

You’ll need a GitBook account to start using the developer platform. If you don’t already have an account, you can sign up for free [here](https://app.gitbook.com/join).
{% endstep %}

{% step %}
### Create a personal access token

After creating a GitBook account, you'll be able to create a personal access token in your [developer settings](https://app.gitbook.com/account/developer).

This token represents your user in GitBook, and allows you to make API calls, create integrations, and publish them to any GitBook spaces you're a part of to test them.

{% hint style="warning" %}
As always with access tokens, this token is specific to your user and should not be shared for use outside of your personal account.
{% endhint %}

Once you have your personal access token, you'll want to understand the differences between the pieces of the GitBook Integrations Platform in order to start developing your first app.
{% endstep %}

{% step %}
### Make your first API call

The example below shows how to make an API call that asks GitBook Assistant a question in a site within your organization.

{% tabs %}
{% tab title="HTTP" %}
To query a GitBook site using the Ask API, send a POST request to the `/v1/orgs/{organizationId}/sites/{siteId}/ask` endpoint. Include your developer token for authentication, provide the question you want answered, and optionally pass context and scope settings.

**Make a basic Ask API request**

1. Set your required headers:
   * `Authorization: Bearer YOUR_SECRET_TOKEN`
   * `Content-Type: application/json`
2. Send a POST request with your query details:

```http
POST /v1/orgs/{organizationId}/sites/{siteId}/ask HTTP/1.1
Host: api.gitbook.com
Authorization: Bearer YOUR_SECRET_TOKEN
Content-Type: application/json
Accept: */*

{
  "question": "How do I get started?",
  "scope": {
    "mode": "default",
  }
}
```

The API will return an answer generated from your site’s content.
{% endtab %}

{% tab title="JavaScript" %}
To send a question to the Ask API from JavaScript, you can use [GitBook’s client library](../integrations/development/client-library/). After initializing the client with your personal access token, call the `askQueryInSpace()` method with your organization ID, site ID, and query payload.

**Ask a question using GitBook’s JavaScript SDK**

1. Install the GitBook API client:

```
npm install @gitbook/api
```

2. Initialize the client and send your Ask query:

{% code title="index.js" %}
```javascript
import { GitBookAPI } from "@gitbook/api";

const ORGANIZATION_ID = "<your organization id>"
const SITE_ID = "<your site id>"
const API_TOKEN = "<your gitbook api token>"

const client = new GitBookAPI({
    authToken: API_TOKEN
});

const stream = await client.orgs.streamAskInSite(
    ORGANIZATION_ID,
    SITE_ID,
    {
        question: "How do I get started?",
        scope: {
            mode: "default",
    },
);

// Stream chunks as they arrive
for await (const chunk of stream) {
    console.log(chunk);
}
```
{% endcode %}

The response will contain the generated answer based on your site’s content.
{% endtab %}

{% tab title="Python" %}
To send a question to the Ask API using Python, make a POST request to the `/v1/orgs/{organizationId}/sites/{siteId}/ask` endpoint. Include your API token for authentication and pass the question, context, and scope in the request body.

**Ask a question using Python**

{% code title="ask_query.py" %}
```python
import json
import requests

ORGANIZATION_ID = "<your organization id>"
SITE_ID = "<your site id>"
API_TOKEN = "<your gitbook api token>"

response = requests.post(
    f"https://api.gitbook.com/v1/orgs/{ORGANIZATION_ID}/sites/{SITE_ID}/ask",
    headers={
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    },
    json={
        "question": "How do I get started?",
        "scope": {"mode": "default"}
    },
    stream=True
)

# Get the last response before "done"
final = None
for line in response.iter_lines():
    if line:
        line = line.decode('utf-8')
        if line.startswith('data: ') and line[6:] != 'done':
            final = json.loads(line[6:])

print(final)
```
{% endcode %}

This will return the Ask API’s generated answer based on your site’s content.
{% endtab %}
{% endtabs %}

GitBook’s API has many different API calls that allow you to interact with GitBook in different ways. After sending your first request, head to the API reference to explore the different endpoints GitBook offers.
{% endstep %}
{% endstepper %}

### Explore GitBook’s API

<table data-view="cards"><thead><tr><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>Create and edit content</strong></td><td><a href="broken-reference">Broken link</a></td></tr><tr><td><strong>Update a site</strong></td><td><a href="broken-reference">Broken link</a></td></tr><tr><td><strong>Work with analytics</strong></td><td><a href="broken-reference">Broken link</a></td></tr></tbody></table>
