---
description: Revisions in GitBook are the entity for updates made to content.
---

# Revisions

### `GET` a specific revision in a space by it's ID

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/revisions/{revisionId}" method="get" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` a specific page in a revision by it's ID

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/revisions/{revisionId}/page/{pageId}" method="get" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` a specific revision in a space by it's path

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/revisions/{revisionId}/path/{pagePath}" method="get" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` files in a specific revision by it's ID

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/revisions/{revisionId}/files" method="get" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}
