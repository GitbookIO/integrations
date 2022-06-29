# Changelog for the REST API

All notable changes to the REST API will be documented in this page.

## 2022-06-30

### Breaking: `url` path parameter for page lookup by path

Requests on page using an url will now require an URL encoded page's path.
For example the previous request:

```
GET /v1/spaces/u23h2u4hi24/content/url/a/b/c
```

should now be:

```
GET /v1/spaces/u23h2u4hi24/content/url/a%2Fb%2Fc
```
