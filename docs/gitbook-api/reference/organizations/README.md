---
description: >-
  An organization in GitBook is the entity of a place that users, spaces, and
  collections belong to.
---

# Organizations

<figure><img src="../../../.gitbook/assets/Organization.png" alt=""><figcaption></figcaption></figure>

### `GET` organizations for current user

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs" method="get" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` collections in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/collections" method="get" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` spaces in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/spaces" method="get" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `POST` an invite to an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/invites" method="post" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}
