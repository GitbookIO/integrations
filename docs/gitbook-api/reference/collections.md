---
description: A collection in GitBook is the entity of a group that a space can belong to.
---

# Collections

<figure><img src="../../.gitbook/assets/Collection.png" alt=""><figcaption></figcaption></figure>

### `GET` a specific collection

{% swagger src="https://api.gitbook.com/openapi.json" path="/collections/{collectionId}" method="get" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` spaces in a collection

{% swagger src="https://api.gitbook.com/openapi.json" path="/collections/{collectionId}/spaces" method="get" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.json" path="/collections/{collectionId}" method="get" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` permissions for all users in a collection

{% swagger src="https://api.gitbook.com/openapi.json" path="/collections/{collectionId}/permissions/aggregate" method="get" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

