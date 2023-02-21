# Content

{% hint style="warning" %}
The GitBook API is currently in **beta**. This means you should not rely on it's availability, and that it may change without prior warning.
{% endhint %}

## Retrieve content from a Space

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/content" method="get" %}
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/content/files" method="get" %}
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/content/page/{pageId}" method="get" %}
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/content/path/{pagePath}" method="get" %}
{% endswagger %}

## Import content to a Space

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/content/import" method="post" %}
{% endswagger %}

{% swagger src="https://api.gitbook.com/openapi.yaml" path="/spaces/{spaceId}/content/page/{pageId}/import" method="post" %}
{% endswagger %}
