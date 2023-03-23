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
