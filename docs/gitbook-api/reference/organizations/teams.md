---
description: >-
  A team in GitBook is the entity of a group that members of an organization
  belong to.
---

# Teams

<figure><img src="../../../.gitbook/assets/Teams.png" alt=""><figcaption></figcaption></figure>

### `GET` teams in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/teams" method="get" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `PUT` a team in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/teams" method="put" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` a specific team in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/teams/{teamId}" method="get" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `PATCH` a specific team in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/teams/{teamId}" method="patch" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `DELETE` a specific team in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/teams/{teamId}" method="delete" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `GET` team members in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/teams/{teamId}/members" method="get" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `PUT` team members in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/teams/{teamId}/members" method="put" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `PUT` a specific team member in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/teams/{teamId}/members/{userId}" method="put" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}

### `DELETE` a specific team member in an organization

{% swagger src="https://api.gitbook.com/openapi.json" path="/orgs/{organizationId}/teams/{teamId}/members/{userId}" method="delete" %}
[https://api.gitbook.com/openapi.json](https://api.gitbook.com/openapi.json)
{% endswagger %}
