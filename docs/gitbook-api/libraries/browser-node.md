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

### User

The following methods can be found on the `client.user` object.

| Method                   |
| ------------------------ |
| `getAuthenticatedUser()` |

### Users

The following methods can be found on the `client.users` object.

| Method          |
| --------------- |
| `getUserById()` |

### Spaces

The following methods can be found on the `client.spaces` object.

| Method                                          |
| ----------------------------------------------- |
| `getSpaceById()`                                |
| `updateSpaceById()`                             |
| `deleteSpaceById()`                             |
| `duplicateSpace()`                              |
| `restoreSpace()`                                |
| `moveSpace()`                                   |
| `transferSpace()`                               |
| `getEmbedByUrlInSpace()`                        |
| `searchSpaceContent()`                          |
| `importGitRepository()`                         |
| `exportToGitRepository()`                       |
| `getSpaceGitInfo()`                             |
| `inviteToSpace()`                               |
| `updateTeamPermissionInSpace()`                 |
| `removeTeamFromSpace()`                         |
| `listUserPermissionsInSpace()`                  |
| `updateUserPermissionInSpace()`                 |
| `removeUserFromSpace()`                         |
| `listTeamPermissionsInSpace()`                  |
| `getCurrentRevision()`                          |
| `importContent()`                               |
| `listPages()`                                   |
| `listFiles()`                                   |
| `getFileById()`                                 |
| `listSpaceFileBacklinks()`                      |
| `getPageById()`                                 |
| `listPageLinksInSpace()`                        |
| `listSpacePageBacklinks()`                      |
| `importContentInPageById()`                     |
| `getPageByPath()`                               |
| `getReusableContentById()`                      |
| `getComputedDocument()`                         |
| `getComputedRevision()`                         |
| `getDocumentById()`                             |
| `createChangeRequest()`                         |
| `listChangeRequestsForSpace()`                  |
| `getChangeRequestById()`                        |
| `updateChangeRequestById()`                     |
| `mergeChangeRequest()`                          |
| `updateChangeRequest()`                         |
| `getReviewsByChangeRequestId()`                 |
| `submitChangeRequestReview()`                   |
| `getRequestedReviewersByChangeRequestId()`      |
| `requestReviewersForChangeRequest()`            |
| `listChangeRequestLinks()`                      |
| `listCommentsInChangeRequest()`                 |
| `postCommentInChangeRequest()`                  |
| `getCommentInChangeRequest()`                   |
| `deleteCommentInChangeRequest()`                |
| `updateCommentInChangeRequest()`                |
| `listCommentRepliesInChangeRequest()`           |
| `postCommentReplyInChangeRequest()`             |
| `getCommentReplyInChangeRequest()`              |
| `updateCommentReplyInChangeRequest()`           |
| `deleteCommentReplyInChangeRequest()`           |
| `getContributorsByChangeRequestId()`            |
| `getRevisionOfChangeRequestById()`              |
| `importContentInChangeRequest()`                |
| `listPagesInChangeRequest()`                    |
| `listFilesInChangeRequestById()`                |
| `getFileInChangeRequestById()`                  |
| `listChangeRequestFileBacklinks()`              |
| `getPageInChangeRequestById()`                  |
| `listPageLinksInChangeRequest()`                |
| `listChangeRequestPageBacklinks()`              |
| `importContentInChangeRequestPageById()`        |
| `getPageInChangeRequestByPath()`                |
| `getReusableContentInChangeRequestById()`       |
| `getChangeRequestPdf()`                         |
| `streamBrainstormChangeRequest()`               |
| `streamImplementChangeRequestTask()`            |
| `getRevisionById()`                             |
| `getRevisionSemanticChanges()`                  |
| `listPagesInRevisionById()`                     |
| `listFilesInRevisionById()`                     |
| `getFileInRevisionById()`                       |
| `getPageInRevisionById()`                       |
| `getPageInRevisionByPath()`                     |
| `getReusableContentInRevisionById()`            |
| `listCommentsInSpace()`                         |
| `postCommentInSpace()`                          |
| `getCommentInSpace()`                           |
| `deleteCommentInSpace()`                        |
| `updateCommentInSpace()`                        |
| `listCommentRepliesInSpace()`                   |
| `postCommentReplyInSpace()`                     |
| `getCommentReplyInSpace()`                      |
| `updateCommentReplyInSpace()`                   |
| `deleteCommentReplyInSpace()`                   |
| `listPermissionsAggregateInSpace()`             |
| `listSpaceIntegrations()`                       |
| `listSpaceIntegrationsBlocks()`                 |
| `listSpaceIntegrationScripts()`                 |
| `getSpaceCustomFields()`                        |
| `updateSpaceCustomFields()`                     |
| `getSpacePdf()`                                 |
| `listSpaceLinks()`                              |

### Collections

The following methods can be found on the `client.collections` object.

| Method                                     |
| ------------------------------------------ |
| `getCollectionById()`                      |
| `updateCollectionById()`                   |
| `deleteCollectionById()`                   |
| `listSpacesInCollectionById()`             |
| `moveCollection()`                         |
| `transferCollection()`                     |
| `inviteToCollection()`                     |
| `listTeamPermissionsInCollection()`        |
| `updateTeamPermissionInCollection()`       |
| `removeTeamFromCollection()`               |
| `listUserPermissionsInCollection()`        |
| `updateUserPermissionInCollection()`       |
| `removeUserFromCollection()`               |
| `listPermissionsAggregateInCollection()`   |

### Integrations

The following methods can be found on the `client.integrations` object.

| Method                                  |
| --------------------------------------- |
| `listIntegrations()`                    |
| `getIntegrationByName()`                |
| `publishIntegration()`                  |
| `unpublishIntegration()`                |
| `listIntegrationInstallations()`        |
| `installIntegration()`                  |
| `listIntegrationEvents()`               |
| `getIntegrationEvent()`                 |
| `listIntegrationSpaceInstallations()`   |
| `setIntegrationDevelopmentMode()`       |
| `disableIntegrationDevelopmentMode()`   |
| `renderIntegrationUiWithGet()`          |
| `renderIntegrationUiWithPost()`         |
| `queueIntegrationTask()`                |
| `getIntegrationInstallationById()`      |
| `updateIntegrationInstallation()`       |
| `uninstallIntegration()`                |
| `createIntegrationInstallationToken()`  |
| `listIntegrationInstallationSpaces()`   |
| `installIntegrationOnSpace()`           |
| `getIntegrationSpaceInstallation()`     |
| `updateIntegrationSpaceInstallation()`  |
| `uninstallIntegrationFromSpace()`       |
| `listIntegrationInstallationSites()`    |
| `installIntegrationOnSite()`            |
| `getIntegrationSiteInstallation()`      |
| `updateIntegrationSiteInstallation()`   |
| `uninstallIntegrationFromSite()`        |

### Orgs

The following methods can be found on the `client.orgs` object.

| Method                                     |
| ------------------------------------------ |
| `listOrganizationsForAuthenticatedUser()`  |
| `getOrganizationById()`                    |
| `updateOrganizationById()`                 |
| `listMembersInOrganizationById()`          |
| `getMemberInOrganizationById()`            |
| `updateMemberInOrganizationById()`         |
| `removeMemberFromOrganizationById()`       |
| `updateOrganizationMemberLastSeenAt()`     |
| `setUserAsSsoMemberForOrganization()`      |
| `listSpacesForOrganizationMember()`        |
| `listTeamsForOrganizationMember()`         |
| `listTeamsInOrganizationById()`            |
| `createOrganizationTeam()`                 |
| `getTeamInOrganizationById()`              |
| `updateTeamInOrganizationById()`           |
| `removeTeamFromOrganizationById()`         |
| `updateMembersInOrganizationTeam()`        |
| `listTeamMembersInOrganizationById()`      |
| `addMemberToOrganizationTeamById()`        |
| `deleteMemberFromOrganizationTeamById()`   |
| `inviteUsersToOrganization()`              |
| `joinOrganizationWithInvite()`             |
| `listOrganizationInviteLinks()`            |
| `createOrganizationInvite()`               |
| `updateOrganizationInviteById()`           |
| `deleteOrganizationInviteById()`           |
| `searchOrganizationContent()`              |
| `listSpacesInOrganizationById()`           |
| `createSpace()`                            |
| `listCollectionsInOrganizationById()`      |
| `createCollection()`                       |
| `listOrganizationCustomFields()`           |
| `createOrganizationCustomField()`          |
| `getOrganizationCustomFieldByName()`       |
| `updateOrganizationCustomField()`          |
| `deleteOrganizationCustomField()`          |
| `listOrganizationIntegrations()`           |
| `getOrganizationIntegrationStatus()`       |
| `listOrganizationInstallations()`          |
| `listOrganizationIntegrationsStatus()`     |
| `listSamlProvidersInOrganizationById()`    |
| `createOrganizationSamlProvider()`         |
| `getOrganizationSamlProviderById()`        |
| `updateOrganizationSamlProvider()`         |
| `deleteOrganizationSamlProvider()`         |
| `listSsoProviderLoginsInOrganization()`    |
| `askInOrganization()`                      |
| `getRecommendedQuestionsInOrganization()`  |
| `streamRecommendedQuestionsInOrganization()` |
| `streamAskInOrganization()`                |
| `listSites()`                              |
| `createSite()`                             |
| `getSiteById()`                            |
| `updateSiteById()`                         |
| `deleteSiteById()`                         |
| `getPublishedContentSite()`                |
| `publishSite()`                            |
| `unpublishSite()`                          |
| `listSiteShareLinks()`                     |
| `createSiteShareLink()`                    |
| `updateSiteShareLinkById()`                |
| `deleteSiteShareLinkById()`                |
| `getSiteStructure()`                       |
| `getSitePublishingAuthById()`              |
| `updateSitePublishingAuthById()`           |
| `regenerateSitePublishingAuthById()`       |
| `getSitePublishingPreviewById()`           |
| `getSiteCustomizationById()`               |
| `updateSiteCustomizationById()`            |
| `listSiteIntegrationScripts()`             |
| `listSiteIntegrations()`                   |
| `addSpaceToSite()`                         |
| `listSiteSpaces()`                         |
| `listSiteSectionGroups()`                  |
| `addSectionGroupToSite()`                  |
| `updateSiteSectionGroupById()`             |
| `deleteSiteSectionGroupById()`             |
| `addSectionToGroup()`                      |
| `removeSectionFromGroup()`                 |
| `addSectionToSite()`                       |
| `listSiteSections()`                       |
| `updateSiteSectionById()`                  |
| `deleteSiteSectionById()`                  |
| `searchSiteContent()`                      |
| `streamAskInSite()`                        |
| `streamRecommendedQuestionsInSite()`       |
| `updateSiteSpaceById()`                    |
| `deleteSiteSpaceById()`                    |
| `getSiteSpaceCustomizationById()`          |
| `overrideSiteSpaceCustomizationById()`     |
| `deleteSiteSpaceCustomizationById()`       |
| `moveSiteSectionGroup()`                   |
| `moveSiteSection()`                        |
| `moveSiteSpace()`                          |
| `listPermissionsAggregateInSite()`         |
| `trackEventsInSiteById()`                  |
| `aggregateSiteEvents()`                    |
| `listSiteVisitorSegments()`                |
| `updateSiteAdsById()`                      |
| `createSiteRedirect()`                     |
| `listSiteRedirects()`                      |
| `updateSiteRedirectById()`                 |
| `deleteSiteRedirectById()`                 |
| `getSiteRedirectBySource()`                |
| `generateSiteStorageUploadUrl()`           |
| `listOpenApiSpecs()`                       |
| `getOpenApiSpecBySlug()`                   |
| `createOrUpdateOpenApiSpecBySlug()`        |
| `deleteOpenApiSpecBySlug()`                |
| `listOpenApiSpecVersions()`                |
| `getLatestOpenApiSpecVersion()`            |
| `getLatestOpenApiSpecVersionContent()`     |
| `getOpenApiSpecVersionById()`              |
| `getOpenApiSpecVersionContentById()`       |

### Custom Hostnames

The following methods can be found on the `client.customHostnames` object.

| Method                       |
| ---------------------------- |
| `getCustomHostname()`        |
| `dnsRevalidateCustomHostname()` |
| `removeCustomHostname()`     |

### Ads

The following methods can be found on the `client.ads` object.

| Method            |
| ----------------- |
| `adsListSites()`  |
| `adsUpdateSite()` |

### Urls

The following methods can be found on the `client.urls` object.

| Method                      |
| --------------------------- |
| `getContentByUrl()`         |
| `getEmbedByUrl()`           |
| `getPublishedContentByUrl()` |
