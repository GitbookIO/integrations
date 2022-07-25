# Revisions

{% hint style="warning" %}
The GitBook API is currently in **beta**. This means you should not rely on it's availability, and that it may change without prior warning.
{% endhint %}

## Retrieve a Revision and Pages

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/revisions/{revisionId}" method="get" %}
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/revisions/{revisionId}/page/{pageId}" method="get" %}
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/revisions/{revisionId}/path/{pagePath}" method="get" %}
{% endswagger %}

## Retrieve files in a Revision

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/revisions/{revisionId}/files" method="get" %}
{% endswagger %}
