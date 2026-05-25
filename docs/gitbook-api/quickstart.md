---
description: Learn how to use the GitBook API within minutes
icon: bolt
---

# Quickstart

The GitBook API allows you to read and write information across the spaces and pages you have access to in GitBook.

You can use the GitBook API to:

* Create, update, and delete [organizations](/broken/pages/d27c140ce3faf40f0cca69a7c3c3fd8959942102), [spaces](/broken/pages/236c16444b4a09a7452918c1df4c355ecb29f18d), [collections](/broken/pages/344c4e16b9a94db6720cc4418a0e80df4e3544f4), and [published docs sites](/broken/pages/657cc880208e956c699dff06252708af625afac4)
* [Manage users, teams, and access permissions](/broken/pages/c970f91a312311faca32e9c25ba50d2f0f339e8e) at both the space and organization level
* [Import and export content](/broken/pages/5347ba54565e21473f7de51af8bf8d68d6d8162d) (pages, files, and reusable content)
* [Create, list, review, merge, and update change requests](/broken/pages/c9484d1c23130ae8bfe4e1d761042e14d43c6794)
* [Post, retrieve, update, and delete comments](/broken/pages/e792dd727868ace7da2c61f9e183f56a492de1b1) (and comment replies)
* [Configure custom hostnames](/broken/pages/969fc13867f2fb506e4e50baeb5424cf4f3cbfa3), URLs, and search settings
* [Monitor content performance](/broken/pages/59fc8fb1624424d4a5a10a480a413f19f284f48a) with analytics endpoints
* [Manage integrations](/broken/pages/a4032cb05dbf7a1290acb36098bb877b427c2f87) and OpenAPI documentation

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

<table data-view="cards"><thead><tr><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>Create and edit content</strong></td><td><a href="/broken/pages/236c16444b4a09a7452918c1df4c355ecb29f18d">Broken link</a></td></tr><tr><td><strong>Update a site</strong></td><td><a href="/broken/pages/657cc880208e956c699dff06252708af625afac4">Broken link</a></td></tr><tr><td><strong>Work with analytics</strong></td><td><a href="/broken/pages/59fc8fb1624424d4a5a10a480a413f19f284f48a">Broken link</a></td></tr></tbody></table>
