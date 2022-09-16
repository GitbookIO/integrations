# Changelog for the REST API

All notable changes to the REST API will be documented in this page.

## 2022-09-16

### API for users management

We are introducing a collection of API endpoints to automate the management of members and teams in an organization:

- [`/v1/orgs/:id/members`](../api/resources/organizations/members.md)
- [`/v1/orgs/:id/invites`](../api/resources/organizations/members.md)
- [`/v1/orgs/:id/teams`](../api/resources/organizations/teams.md)

## 2022-06-30

### Breaking: removing `/v1/owners/:id` endpoints

Endpoint `/v1/owners/:id/spaces` has been removed and replaced by:
- `/v1/orgs/:id/spaces` for an organization
- `/v1/users/:id/spaces` for a user

### Breaking: `path` and `slug` properties in pages

Page previously had only one `path` property representing the page slug in its direct page parent.
Pages will now include 2 properties:

- `slug`: representing the page's slug in its direct parent
- `path`: representing the complete page's path in the revision

### Breaking: `url` path parameter for page lookup by path

Requests on page using a URL will now require a URL encoded page's path.
For example the previous request:

```
GET /v1/spaces/u23h2u4hi24/content/url/a/b/c
```

should now be:

```
GET /v1/spaces/u23h2u4hi24/content/path/a%2Fb%2Fc
```

### `createChangeRequest` returns entire change-request

Previously `POST /v1/spaces/:space/change-requests` was only returning the ID of the newly created change-request.

The response will now contain the entire change-request object. A property `changeRequest` is appended for compatibility, but marked as deprecated and will be removed in the near future.