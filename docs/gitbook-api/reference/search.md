---
description: >-
  Search in GitBook is the entity for searches made across organizations,
  spaces, and pages.
---

# Search

### `GET` search results from all spaces for the current user

{% swagger src="../../.gitbook/assets/openapi.json" path="/search" method="get" %}
[openapi.json](../../.gitbook/assets/openapi.json)
{% endswagger %}

### `GET` search results from a specific organization

{% swagger src="../../.gitbook/assets/openapi.json" path="/orgs/{organizationId}/search" method="get" %}
[openapi.json](../../.gitbook/assets/openapi.json)
{% endswagger %}

### `GET` search results from a specific space

{% swagger src="../../.gitbook/assets/openapi.json" path="/spaces/{spaceId}/search" method="get" %}
[openapi.json](../../.gitbook/assets/openapi.json)
{% endswagger %}







<figure><img src="../../.gitbook/assets/GitBook AI - Lens horizontal (1).png" alt=""><figcaption><p>GitBook Lens API</p></figcaption></figure>

### `GET` AI search results from all spaces for the currently authenticated user

{% swagger src="https://api.gitbook.com/openapi.json" path="/search/ask" method="get" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}
