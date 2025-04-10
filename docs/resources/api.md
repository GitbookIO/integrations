---
icon: bars-staggered
---

# Changelog

## August 5, 2024

### :boom: Breaking Changes&#x20;

With the release of Docs sites, certain API endpoints for publishing, share-links, and visitor authentication have been deprecated and may no longer function as expected. If you are affected, we recommend the following approach to make the necessary updates:

To modify  or retrieve publishing states, share links, or visitor authentication settings for a Space, locate the associated Site and copy its ID. Click the globe icon at the top of the Space's screen to open the Site, then copy the Site ID from the URL.

#### Publishing

`PATCH /spaces/{spaceId}` to change the `visibility` or published state of the space now requires the following changes:

* `PATCH /orgs/{organizationId}/sites/{siteId}` to change the visibility of the site.
* `POST /orgs/{organizationId}/sites/{siteId}/publish`  in order to publish the site and `POST /orgs/{organizationId}/sites/{siteId}/unpublish` to unpublish the site.

#### Share Links

`/spaces/{spaceId}/share-links` and `/spaces/{spaceId}/share-links/{shareLinkId}` now requires you to use `/orgs/{organizationId}/sites/{siteId}/share-links` and `/orgs/{organizationId}/sites/{siteId}/share-links/{shareLinkId}`respectively.

#### Visitor Authentication (publishing auth)

`/spaces/{spaceId}/publishing/auth` methods should now be used through `/orgs/{organizationId}/sites/{siteId}/publishing/auth`

## November 16, 2023

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

## September 6, 2022

### API for users management

We are introducing a collection of API endpoints to automate the management of members and teams in an organization:

* `/v1/orgs/:id/members`
* `/v1/orgs/:id/invites`
* `/v1/orgs/:id/teams`

## June 30, 2022

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
