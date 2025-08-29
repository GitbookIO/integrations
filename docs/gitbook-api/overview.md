---
description: Automate and integrate your documentation with GitBook’s API.
icon: bullseye-arrow
---

# Introduction

The GitBook API allows you to read and write information across the spaces and pages you have access to in GitBook.&#x20;

You can use the GitBook API to:

* Create, update, and delete organizations, spaces, collections, and published docs sites
* Manage users, teams, and access permissions at both the space and organization level
* Import and export content (pages, files, and reusable content)
* Create, list, review, merge, and update change requests
* Post, retrieve, update, and delete comments (and comment replies)
* Configure custom hostnames, URLs, and search settings
* Monitor content performance with analytics endpoints
* Manage integrations and OpenAPI documentation

…and much more, all via simple REST calls.

### API Endpoint

The GitBook API can be accessed using the `api.gitbook.com` hostname:

```bash
curl https://api.gitbook.com/v1/
{"version":"10.9.128","build":"2022-07-19T13:00:05.548Z"}
```
