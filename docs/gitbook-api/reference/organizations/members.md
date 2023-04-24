---
description: A member in GitBook is the entity of a user associated with an organization.
---

# Members

<figure><img src="../../../.gitbook/assets/Members.png" alt=""><figcaption></figcaption></figure>

### `GET` members in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/members" method="get" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` a specific member in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/members/{userId}" method="get" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `PATCH` a specific member in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/members/{userId}" method="patch" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `DELETE` a specific member in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/members/{userId}" method="delete" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `POST` a user as an SSO member in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/members/{userId}/sso" method="post" expanded="true" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}
