---
description: Learn about the available methods from the GitBook client library
---

# GitBook methods

#### Search

The following methods can be found on the `client.search` object.

| Method            |
| ----------------- |
| `searchContent()` |
| `askQuery()`      |

#### User

The following methods can be found on the `client.user` object.

<table><thead><tr><th width="770.3333333333333">Method</th></tr></thead><tbody><tr><td><code>getAuthenticatedUser()</code></td></tr><tr><td><code>listSpacesForAuthenticatedUser()</code></td></tr></tbody></table>

#### Users

The following methods can be found on the `client.users` object.

| Method          |
| --------------- |
| `getUserById()` |

#### Spaces

The following methods can be found on the `client.spaces` object.

<table><thead><tr><th width="750.3333333333333">Method</th></tr></thead><tbody><tr><td><code>getSpaceById()</code></td></tr><tr><td><code>searchSpaceContent()</code></td></tr><tr><td><code>askQueryInSpace()</code></td></tr><tr><td><code>importGitRepository()</code></td></tr><tr><td><code>exportToGitRepository()</code></td></tr><tr><td><code>getContentAnalyticsForSpaceById()</code></td></tr><tr><td><code>getSearchAnalyticsForSpaceById()</code></td></tr><tr><td><code>getTrafficAnalyticsForSpaceById()</code></td></tr><tr><td><code>trackViewInSpaceById()</code></td></tr><tr><td><code>getCurrentRevision()</code></td></tr><tr><td><code>importContent()</code></td></tr><tr><td><code>listFiles()</code></td></tr><tr><td><code>getPageById()</code></td></tr><tr><td><code>importContentInPageById()</code></td></tr><tr><td><code>getPageByPath()</code></td></tr><tr><td><code>createChangeRequest()</code></td></tr><tr><td><code>mergeChangeRequest()</code></td></tr><tr><td><code>updateChangeRequest()</code></td></tr><tr><td><code>getRevisionOfChangeRequestById()</code></td></tr><tr><td><code>importContentInChangeRequest()</code></td></tr><tr><td><code>listFilesInChangeRequestById()</code></td></tr><tr><td><code>getPageInChangeRequestById()</code></td></tr><tr><td><code>importContentInChangeRequestPageById()</code></td></tr><tr><td><code>getPageInChangeRequestByPath()</code></td></tr><tr><td><code>getRevisionById()</code></td></tr><tr><td><code>listFilesInRevisionById()</code></td></tr><tr><td><code>getPageInRevisionById()</code></td></tr><tr><td><code>getPageInRevisionByPath()</code></td></tr><tr><td><code>listPermissionsAggregateInSpace()</code></td></tr></tbody></table>

#### Collections

The following methods can be found on the `client.collections` object.

| Method                                   |
| ---------------------------------------- |
| `getCollectionById()`                    |
| `listSpacesInCollectionById()`           |
| `listPermissionsAggregateInCollection()` |

#### Integrations

The following methods can be found on the `client.integrations` object.

<table><thead><tr><th width="749.3333333333333">Method</th></tr></thead><tbody><tr><td><code>listIntegrations()</code></td></tr><tr><td><code>getIntegrationByName()</code></td></tr><tr><td><code>publishIntegration()</code></td></tr><tr><td><code>unpublishIntegration()</code></td></tr><tr><td><code>listIntegrationInstallations()</code></td></tr><tr><td><code>listIntegrationSpaceInstallations()</code></td></tr><tr><td><code>renderIntegrationUiWithGet()</code></td></tr><tr><td><code>renderIntegrationUiWithPost()</code></td></tr><tr><td><code>updateIntegrationInstallation()</code></td></tr><tr><td><code>createIntegrationInstallationToken()</code></td></tr><tr><td><code>updateIntegrationSpaceInstallation()</code></td></tr></tbody></table>

#### Orgs

The following methods can be found on the `client.orgs` object.

<table><thead><tr><th width="744.3333333333333">Method</th></tr></thead><tbody><tr><td><code>listOrganizationsForAuthenticatedUser()</code></td></tr><tr><td><code>listMembersInOrganizationById()</code></td></tr><tr><td><code>getMemberInOrganizationById()</code></td></tr><tr><td><code>updateMemberInOrganizationById()</code></td></tr><tr><td><code>removeMemberFromOrganizationById()</code></td></tr><tr><td><code>setUserAsSsoMemberForOrganization()</code></td></tr><tr><td><code>listSpacesForOrganizationMember()</code></td></tr><tr><td><code>listTeamsInOrganizationById()</code></td></tr><tr><td><code>createOrganizationTeam()</code></td></tr><tr><td><code>getTeamInOrganizationById()</code></td></tr><tr><td><code>updateTeamInOrganizationById()</code></td></tr><tr><td><code>removeTeamFromOrganizationById()</code></td></tr><tr><td><code>updateMembersInOrganizationTeam()</code></td></tr><tr><td><code>listTeamMembersInOrganizationById()</code></td></tr><tr><td><code>addMemberToOrganizationTeamById()</code></td></tr><tr><td><code>deleteMemberFromOrganizationTeamById()</code></td></tr><tr><td><code>inviteUsersToOrganization()</code></td></tr><tr><td><code>joinOrganizationWithInvite()</code></td></tr><tr><td><code>upgradeOrganizationPlan()</code></td></tr><tr><td><code>getOrganizationBillingPortal()</code></td></tr><tr><td><code>requestOrganizationUpgrade()</code></td></tr><tr><td><code>transferOrganization()</code></td></tr><tr><td><code>searchOrganizationContent()</code></td></tr><tr><td><code>listSpacesInOrganizationById()</code></td></tr><tr><td><code>listCollectionsInOrganizationById()</code></td></tr><tr><td><code>setupDirectorySync()</code></td></tr><tr><td><code>listDirectorySyncGroups()</code></td></tr><tr><td><code>syncDirectorySyncGroupsToTeams()</code></td></tr></tbody></table>

#### Urls

The following methods can be found on the `client.urls` object.

| Method              |
| ------------------- |
| `getContentByUrl()` |
