# Errors

{% hint style="warning" %}
The GitBook API is currently in **beta**. This means you should not rely on it's availability, and that it may change without prior warning.
{% endhint %}

GitBook uses conventional HTTP response codes to indicate the success or failure of an API request.

As a general rule:

* Codes in the `2xx` range indicate success
* Codes in the `4xx` range indicate incorrect or incomplete parameters (e.g. a required parameter was omitted, or an operation failed with a 3rd party, etc.)
* Codes in the `5xx` range indicate an error with GitBook's servers.

GitBook also outputs an error message and an error code formatted in JSON:

```json
{
    "error": {
        "code": 404,
        "message": "Page not found in this space"
    }
}
```