---
description: Query site event data to identify your most-visited pages.
---

# Pull analytics from your site

Use the Events Aggregation API to list your published site’s most-visited pages.

### Before you begin

You need:

* A GitBook API token that can read site insights.
* Your organization ID and site ID.
* A terminal with `curl`.

For OAuth, request the `site:insights:read` scope.

### Request page metrics

Send this request to group events by page URL and sort them by event count:

```bash
curl --request POST \
  --url "https://api.gitbook.com/v1/orgs/$ORGANIZATION_ID/sites/$SITE_ID/insights/events/aggregate" \
  --header "Authorization: Bearer $GITBOOK_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "select": [
      { "column": "url" },
      { "column": "eventsCount" },
      { "column": "visitorsCount" }
    ],
    "groupBy": [
      { "column": "url" }
    ],
    "order": {
      "by": { "column": "eventsCount" },
      "direction": "desc"
    },
    "range": "last30Days",
    "limit": 20
  }'
```

### Read the results

Each result identifies a page URL and its event and visitor counts.

The first result has the highest event count for the selected range.

### Refine the report

You can adapt the request for a different report:

* Change `range` to use another supported period.
* Change `limit` to return fewer or more pages.
* Select other supported fields for a deeper report.

See the [Site insights reference](https://app.gitbook.com/s/2SyQSbIa1iYS7z6Dx5di/gitbook-api/api-reference/docs-sites/site-insights) for supported fields and filters.
