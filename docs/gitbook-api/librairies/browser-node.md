---
description: GitBook's official Node.js client library.
---

# Node.js

## Overview

GitBook provides an official Typescript/Javascript client for the HTTP API. This client can be used in a browser or Node.js environment.

## Installation

You can install the GitBook Node.js library through `npm`.

```
npm install @gitbook/api
```

## Usage

#### General usage:

```typescript
import { GitBookAPI } from '@gitbook/api';

const client = new GitBookAPI({
  authToken: <your_access_token>
});
```

#### Usage with Node.js

When using the `@gitbook/api` module with Node.js < v18, you should pass a custom `fetch` function.

You can install one using the [`node-fetch`](https://github.com/node-fetch/node-fetch) module.

```typescript
import { GitBookAPI } from '@gitbook/api';
import fetch from 'node-fetch';

const client = new GitBookAPI({
  customFetch: fetch
});
```

## Reference

### Search

The following methods can be found on the `client.search` object.

| Method            |
| ----------------- |
| `searchContent()` |
| `askQuery()`      |

### User

The following methods can be found on the `client.user` object.

| Method                             |
| ---------------------------------- |
| `getAuthenticatedUser()`           |
| `listSpacesForAuthenticatedUser()` |

### Users

The following methods can be found on the `client.users` object.

| Method          |
| --------------- |
| `getUserById()` |

### Spaces

The following methods can be found on the `client.spaces` object.

| Method                                   |
| ---------------------------------------- |
| `getSpaceById()`                         |
| `searchSpaceContent()`                   |
| `askQueryInSpace()`                      |
| `importGitRepository()`                  |
| `exportToGitRepository()`                |
| `getContentAnalyticsForSpaceById()`      |
| `getSearchAnalyticsForSpaceById()`       |
| `getTrafficAnalyticsForSpaceById()`      |
| `trackViewInSpaceById()`                 |
| `getCurrentRevision()`                   |
| `importContent()`                        |
| `listFiles()`                            |
| `getPageById()`                          |
| `importContentInPageById()`              |
| `getPageByPath()`                        |
| `createChangeRequest()`                  |
| `mergeChangeRequest()`                   |
| `updateChangeRequest()`                  |
| `getRevisionOfChangeRequestById()`       |
| `importContentInChangeRequest()`         |
| `listFilesInChangeRequestById()`         |
| `getPageInChangeRequestById()`           |
| `importContentInChangeRequestPageById()` |
| `getPageInChangeRequestByPath()`         |
| `getRevisionById()`                      |
| `listFilesInRevisionById()`              |
| `getPageInRevisionById()`                |
| `getPageInRevisionByPath()`              |
| `listPermissionsAggregateInSpace()`      |

### Collections

The following methods can be found on the `client.collections` object.

| Method                                   |   |   |
| ---------------------------------------- | - | - |
| `getCollectionById()`                    |   |   |
| `listSpacesInCollectionById()`           |   |   |
| `listPermissionsAggregateInCollection()` |   |   |

### Integrations

The following methods can be found on the `client.integrations` object.

| Method                                 |
| -------------------------------------- |
| `listIntegrations()`                   |
| `getIntegrationByName()`               |
| `publishIntegration()`                 |
| `unpublishIntegration()`               |
| `listIntegrationInstallations()`       |
| `listIntegrationSpaceInstallations()`  |
| `renderIntegrationUiWithGet()`         |
| `renderIntegrationUiWithPost()`        |
| `updateIntegrationInstallation()`      |
| `createIntegrationInstallationToken()` |
| `updateIntegrationSpaceInstallation()` |

### Orgs

The following methods can be found on the `client.orgs` object.

| Method                                    |
| ----------------------------------------- |
| `listOrganizationsForAuthenticatedUser()` |
| `listMembersInOrganizationById()`         |
| `getMemberInOrganizationById()`           |
| `updateMemberInOrganizationById()`        |
| `removeMemberFromOrganizationById()`      |
| `setUserAsSsoMemberForOrganization()`     |
| `listSpacesForOrganizationMember()`       |
| `listTeamsInOrganizationById()`           |
| `createOrganizationTeam()`                |
| `getTeamInOrganizationById()`             |
| `updateTeamInOrganizationById()`          |
| `removeTeamFromOrganizationById()`        |
| `updateMembersInOrganizationTeam()`       |
| `listTeamMembersInOrganizationById()`     |
| `addMemberToOrganizationTeamById()`       |
| `deleteMemberFromOrganizationTeamById()`  |
| `inviteUsersToOrganization()`             |
| `joinOrganizationWithInvite()`            |
| `upgradeOrganizationPlan()`               |
| `getOrganizationBillingPortal()`          |
| `requestOrganizationUpgrade()`            |
| `transferOrganization()`                  |
| `searchOrganizationContent()`             |
| `listSpacesInOrganizationById()`          |
| `listCollectionsInOrganizationById()`     |
| `setupDirectorySync()`                    |
| `listDirectorySyncGroups()`               |
| `syncDirectorySyncGroupsToTeams()`        |

### Urls

The following methods can be found on the `client.urls` object.

| Method              |
| ------------------- |
| `getContentByUrl()` |
