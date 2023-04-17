---
description: >-
  Search in GitBook is the entity for searches made across organizations,
  spaces, and pages.
---

# Search

### `GET` search results from all spaces for the current user

{% swagger src="https://api.gitbook.com/openapi.json" path="/search" method="get" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` search results from a specific organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/search" method="get" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` search results from a specific space

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/search" method="get" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}







<figure><img src="../../.gitbook/assets/GitBook AI - Lens horizontal (1).png" alt=""><figcaption><p>GitBook Lens API</p></figcaption></figure>

### `POST` AI Ask question on all content accessible by the authenticated user

{% swagger src="https://api.gitbook.com/openapi.json" path="/search/ask" method="post" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `POST` AI Ask question in a specific space&#x20;

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/search/ask" method="post" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `POST` AI Get recommended questions in a space

{% swagger src="https://api.gitbook.com/openapi.json" path="/search/questions" method="post" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}
