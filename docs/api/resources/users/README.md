# Users

{% hint style="warning" %}
The GitBook API is currently in **beta**. This means you should not rely on it's availability, and that it may change without prior warning.
{% endhint %}

## Retrieve info & Search content of the authenticated User

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/user" method="get" %}
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/user/spaces" method="get" %}
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/orgs" method="get" %}
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/search" method="get" %}
{% endswagger %}

## Retrieve a specific User

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/users/{userId}" method="get" %}
{% endswagger %}