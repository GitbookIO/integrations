---
description: Content in GitBook is the entity for content on a page.
---

# Content

### `GET` the primary content in a space

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/content" method="get" %}
[https://api.gitbook.com/openapi.yaml](https://api.gitbook.com/openapi.yaml)
{% endswagger %}

### `GET` files for the primary content in a space

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/content/files" method="get" %}
[https://api.gitbook.com/openapi.yaml](https://api.gitbook.com/openapi.yaml)
{% endswagger %}

### `GET` a page from the primary content in a space by ID

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/content/page/{pageId}" method="get" %}
[https://api.gitbook.com/openapi.yaml](https://api.gitbook.com/openapi.yaml)
{% endswagger %}

### `GET` a page from the primary content in a space by path

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/content/path/{pagePath}" method="get" %}
[https://api.gitbook.com/openapi.yaml](https://api.gitbook.com/openapi.yaml)
{% endswagger %}

### `POST` content to a space

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/content/import" method="post" %}
[https://api.gitbook.com/openapi.yaml](https://api.gitbook.com/openapi.yaml)
{% endswagger %}

### `POST`content to a page by ID

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/content/page/{pageId}/import" method="post" %}
[https://api.gitbook.com/openapi.yaml](https://api.gitbook.com/openapi.yaml)
{% endswagger %}
