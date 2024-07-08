# API

All notable changes to the REST API will be documented in this page.

## 2023-11-16

### Breaking: changing feedback score computation logic

We have changed the way we compute the feedback score based on user ratings which is affecting the following endpoint: `/v1/spaces/:id/insights/content`

* <mark style="color:orange;">**\[Updated]**</mark> `score` is now calculated this way$$score = positives - 0.5 * intermediates - 2*negatives$$.\
  This is done to reinforce negative ratings and help surfacing content that may require updates.
* <mark style="color:orange;">**\[Updated]**</mark> `rating` is now computed this way
  * `'good'` whenever the score is > 0
  * `'ok'` whenever the score is 0
  * `'bad'` whenever the score is < 0
* <mark style="color:green;">**\[Added]**</mark> `ponderedScore` is computed by multiplying the `score` by the total amount of ratings given by visitors.

**Note: The GitBook app is displaying `ponderedScore` inside of the Insights section.**

## 2022-09-16

### API for users management

We are introducing a collection of API endpoints to automate the management of members and teams in an organization:

* [`/v1/orgs/:id/members`](../gitbook-api/reference/organizations/members.md)
* [`/v1/orgs/:id/invites`](../gitbook-api/reference/organizations/members.md)
* [`/v1/orgs/:id/teams`](../gitbook-api/reference/organizations/teams.md)

## 2022-06-30

### Breaking: removing `/v1/owners/:id` endpoints

Endpoint `/v1/owners/:id/spaces` has been removed and replaced by:

* `/v1/orgs/:id/spaces` for an organization
* `/v1/users/:id/spaces` for a user

### Breaking: `path` and `slug` properties in pages

Page previously had only one `path` property representing the page slug in its direct page parent. Pages will now include 2 properties:

* `slug`: representing the page's slug in its direct parent
* `path`: representing the complete page's path in the revision

### Breaking: `url` path parameter for page lookup by path

Requests on page using a URL will now require a URL encoded page's path. For example the previous request:

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
