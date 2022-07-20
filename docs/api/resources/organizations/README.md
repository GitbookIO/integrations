# Organizations

{% hint style="warning" %}
The GitBook API is currently in **beta**. This means you should not rely on it's availability, and that it may change without prior warning.
{% endhint %}

## Retrieve Spaces in an Organization

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/orgs/{organizationId}/spaces" method="get" %}
{% endswagger %}

## Search an Organization

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/orgs/{organizationId}/search" method="get" %}
{% endswagger %}

## Update Members

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/orgs/{organizationId}/members/{userId}/sso" method="post" %}
{% endswagger %}
