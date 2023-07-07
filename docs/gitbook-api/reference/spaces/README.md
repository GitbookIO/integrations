---
description: A space in GitBook is the entity of a project you work in.
---

# Spaces

### `GET` spaces for current user

{% swagger src="https://api.gitbook.com/openapi.json" path="/user/spaces" method="get" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` a specific space

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}" method="get" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

## `GET` permissions for all users in a space

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/permissions/aggregate" method="get" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `POST` a new space in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/spaces" method="post" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `POST` a duplicate of a space

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}/duplicate" method="post" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `UPDATE` a specific space

{% swagger src="https://api.gitbook.com/openapi.json" path="/spaces/{spaceId}" method="patch" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}
