---
description: Create a team from existing organization members.
---

# Manage your team with the API

Create a team with existing members through the GitBook API.

### Before you begin

You need:

* An API token that can read and manage organization members.
* Your organization ID.
* A terminal with `curl`.

For OAuth, request `organization:members:read` and `organization:members:write`.

### List organization members

Request your organization’s members to find the IDs you want to add:

```bash
curl --request GET \
  --url "https://api.gitbook.com/v1/orgs/$ORGANIZATION_ID/members" \
  --header "Authorization: Bearer $GITBOOK_TOKEN"
```

Copy the `id` for each member you want in the team.

### Create a team

Create an `API documentation` team and assign the member IDs:

```bash
curl --request PUT \
  --url "https://api.gitbook.com/v1/orgs/$ORGANIZATION_ID/teams" \
  --header "Authorization: Bearer $GITBOOK_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "title": "API documentation",
    "members": [
      "<memberId>"
    ]
  }'
```

The response includes the new team’s `id`.

### Verify the team

List teams to confirm the new team:

```bash
curl --request GET \
  --url "https://api.gitbook.com/v1/orgs/$ORGANIZATION_ID/teams" \
  --header "Authorization: Bearer $GITBOOK_TOKEN"
```

Use the returned team ID to list its members:

```bash
curl --request GET \
  --url "https://api.gitbook.com/v1/orgs/$ORGANIZATION_ID/teams/$TEAM_ID/members" \
  --header "Authorization: Bearer $GITBOOK_TOKEN"
```

See the [Organization members reference](https://app.gitbook.com/s/2SyQSbIa1iYS7z6Dx5di/gitbook-api/api-reference/organizations/organization-members) to manage members and roles.
