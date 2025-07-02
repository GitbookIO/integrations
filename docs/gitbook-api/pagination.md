---
icon: list-tree
---

# Pagination

Some methods return paginated results. The formatting of a paginated result is always:

```json
{
    "items": [
        ...
    ],
    "next": {
        "page": "..."
    },
    "previous": {
        "page": "..."
    }
}
```

The objects `previous` and `next` will be omitted if there are no previous or next items respectively.

The `next.page` and `previous.page` values can be added to the query parameters of the original query under the `page` key in order to get the next or previous page.

### Example

You make a GET request to a paginated endpoint `https://api.example.com/foo/bar`, and receive the following response:

```json
{
  "items": [],
  "next": {
    "page": "next-page-id"
  }
}
```

In order to get the next page of results, you would take the ID at position `.next.page` in the response body, and provide it as the value of the `page` key in a query to the same endpoint. The full URL including query parameters of your request to get the next page of the listing is:

```
https://api.example.com/foo/bar?page=next-page-id
```
