---
description: Install and use GitBook's official Node.js client library
---

# Client library

GitBook provides an official TypeScript and JavaScript client for the [HTTP API](../../gitbook-api/api-reference/). Use it in browsers or Node.js.

### Install

The GitBook CLI installs the client when you [bootstrap an integration](../quickstart.md#bootstrap-your-app). To add it manually, run:

```bash
npm install @gitbook/api
```

### Initialize

Initialize the client with your [developer token](../quickstart.md#create-a-personal-access-token):

```typescript
import { GitBookAPI } from '@gitbook/api';

const client = new GitBookAPI({
  authToken: <your_access_token>
});
```

#### Node.js

If you use Node.js earlier than version 18, pass a custom `fetch` function. You can install one with [`node-fetch`](https://github.com/node-fetch/node-fetch):

```typescript
import { GitBookAPI } from '@gitbook/api';
import fetch from 'node-fetch';

const client = new GitBookAPI({
  customFetch: fetch
});
```

The client groups methods by GitBook resource.

### Search

Methods on `client.search`:

* `searchContent()`
* `askQuery()`

### User and users

Methods on `client.user`:

* `getAuthenticatedUser()`
* `listSpacesForAuthenticatedUser()`

Methods on `client.users`:

* `getUserById()`

### Spaces

Methods on `client.spaces`:

* `getSpaceById()`
* `searchSpaceContent()`
* `askQueryInSpace()`
* `importGitRepository()`
* `exportToGitRepository()`
* `getContentAnalyticsForSpaceById()`
* `getSearchAnalyticsForSpaceById()`
* `getTrafficAnalyticsForSpaceById()`
* `trackViewInSpaceById()`
* `getCurrentRevision()`
* `importContent()`
* `listFiles()`
* `getPageById()`
* `importContentInPageById()`
* `getPageByPath()`
* `createChangeRequest()`
* `mergeChangeRequest()`
* `updateChangeRequest()`
* `getRevisionOfChangeRequestById()`
* `importContentInChangeRequest()`
* `listFilesInChangeRequestById()`
* `getPageInChangeRequestById()`
* `importContentInChangeRequestPageById()`
* `getPageInChangeRequestByPath()`
* `getRevisionById()`
* `listFilesInRevisionById()`
* `getPageInRevisionById()`
* `getPageInRevisionByPath()`
* `listPermissionsAggregateInSpace()`

### Collections

Methods on `client.collections`:

* `getCollectionById()`
* `listSpacesInCollectionById()`
* `listPermissionsAggregateInCollection()`

### Integrations

Methods on `client.integrations`:

* `listIntegrations()`
* `getIntegrationByName()`
* `publishIntegration()`
* `unpublishIntegration()`
* `listIntegrationInstallations()`
* `listIntegrationSpaceInstallations()`
* `renderIntegrationUiWithGet()`
* `renderIntegrationUiWithPost()`
* `updateIntegrationInstallation()`
* `createIntegrationInstallationToken()`
* `updateIntegrationSpaceInstallation()`

### Organizations

Methods on `client.orgs`:

* `listOrganizationsForAuthenticatedUser()`
* `listMembersInOrganizationById()`
* `getMemberInOrganizationById()`
* `updateMemberInOrganizationById()`
* `removeMemberFromOrganizationById()`
* `setUserAsSsoMemberForOrganization()`
* `listSpacesForOrganizationMember()`
* `listTeamsInOrganizationById()`
* `createOrganizationTeam()`
* `getTeamInOrganizationById()`
* `updateTeamInOrganizationById()`
* `removeTeamFromOrganizationById()`
* `updateMembersInOrganizationTeam()`
* `listTeamMembersInOrganizationById()`
* `addMemberToOrganizationTeamById()`
* `deleteMemberFromOrganizationTeamById()`
* `inviteUsersToOrganization()`
* `joinOrganizationWithInvite()`
* `upgradeOrganizationPlan()`
* `getOrganizationBillingPortal()`
* `requestOrganizationUpgrade()`
* `transferOrganization()`
* `searchOrganizationContent()`
* `listSpacesInOrganizationById()`
* `listCollectionsInOrganizationById()`
* `setupDirectorySync()`
* `listDirectorySyncGroups()`
* `syncDirectorySyncGroupsToTeams()`

### URLs

Methods on `client.urls`:

* `getContentByUrl()`
