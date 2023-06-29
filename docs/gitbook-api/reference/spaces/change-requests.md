---
description: >-
  A change request in GitBook is the entity of a revision to a space in
  progress.
---

# Change Requests

<figure><img src="../../../.gitbook/assets/Change Request.png" alt=""><figcaption></figcaption></figure>

### `GET` a list of Change Requests in a space

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/change-requests" method="get" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `POST` a new Change Request in a space

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/change-requests" method="post" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `POST` a merge for a specific Change Request

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/change-requests/{changeRequestId}/merge" method="post" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `POST` updates to Change Request with primary content

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/change-requests/{changeRequestId}/update" method="post" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` content in a Change Request

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/change-requests/{changeRequestId}/content" method="get" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` files in a Change Request

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/change-requests/{changeRequestId}/content/files" method="get" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `POST` content to a Change Request

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/change-requests/{changeRequestId}/content/import" method="post" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` a page in a Change Request by it's path

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/change-requests/{changeRequestId}/content/path/{pagePath}" method="get" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` a page in a Change Request by it's ID

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/change-requests/{changeRequestId}/content/page/{pageId}" method="get" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `POST` external content to a page in a Change Request by it's ID

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/change-requests/{changeRequestId}/content/page/{pageId}/import" method="post" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}
