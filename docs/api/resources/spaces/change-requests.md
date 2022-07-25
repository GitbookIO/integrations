# Change Requests

{% hint style="warning" %}
The GitBook API is currently in **beta**. This means you should not rely on it's availability, and that it may change without prior warning.
{% endhint %}

## Create, merge & update a Change Request

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/change-requests" method="post" %}
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/change-requests/{changeRequestId}/merge" method="post" %}
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/change-requests/{changeRequestId}/update" method="post" %}
{% endswagger %}

## Change Request's content

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/change-requests/{changeRequestId}/content" method="get" %}
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/change-requests/{changeRequestId}/content/files" method="get" %}
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/change-requests/{changeRequestId}/content/import" method="post" %}
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/change-requests/{changeRequestId}/content/path/{pagePath}" method="get" %}
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/change-requests/{changeRequestId}/content/page/{pageId}" method="get" %}
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/change-requests/{changeRequestId}/content/page/{pageId}/import" method="post" %}
{% endswagger %}