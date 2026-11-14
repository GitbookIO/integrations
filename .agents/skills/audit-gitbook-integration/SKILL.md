---
name: audit-gitbook-integration
description: Audit GitBook integrations for script injection, sensitive-data access, unsafe requests, authorization gaps, and manifest or dependency risk. Use for a requested integration security review, not routine feature work.
---

# Audit GitBook integrations

## Context

GitBook is a platform for creating and publishing documentation sites.
Integrations are installable extensions to a customer's documentation site and run in the Cloudflare Workers for Platform service.
Integrations extend docs sites with outside tools, custom UI, and automated workflows.

They do three main things:
- Connect GitBook to other products — analytics, support, auth, Git, and more.
- Add custom experiences — blocks, components, and embedded tools in your docs.
- React to events — for example, page views, content updates, or Git sync activity.

Users can install them at the organization, site, or space level. Some integrations are built-in, while others are developer-built.

For more information, see:
- https://gitbook.com/docs/manage-your-site/install-an-integration
- https://gitbook.com/docs/developers/integrations/development/runtime

Keep in mind that some integrations inject scripts into the users' page by design.
That's not necessarily always malicious or a security concern.

## Goal of this skill

The goal of this skill is to run a static code audit on the security of a given GitBook integration.
There's no need to set up a plan, or ask the user to validate the plan. Just do the audit and output a report and a score.

## Step 1: Ask the user which integration to audit

Immediately prompt the user to provide an integration to audit.
That can be:
- an integration in the https://github.com/gitbookio/integrations repository.
  - these are usually trusted code snippets from the GitBook team
- an integration from a different repository
  - these are usually untrusted code snippets submitted by users
- the code of an integration, directly pulled from Cloudflare.
  - these are usually untrusted code snippets submitted by users
  - Advise the user that to pull the code from Cloudflare, they'll need to run this curl command:
  - `curl \
    "https://api.cloudflare.com/client/v4/accounts/4401d86825a13bf607936cc3a9f3897a/workers/dispatch/namespaces/gitbook-x-prod-integrations/scripts/INTEGRATION_NAME/content" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"`

## Step 2: Inspect the Integration

Check for:
- Data theft: leaking cookies, tokens, request bodies, secrets, or database contents through requests, responses, logs, or storage.
- Unexpected network calls: unexplained destinations, credential forwarding, arbitrary URL fetching, open proxies.
- Permission abuse: using bindings or platform RPC capabilities for unauthorized reads, writes, deletes, or actions.
- Backdoors: hidden endpoints, magic headers, hardcoded credentials, authentication bypasses.
- Hidden triggers: behavior activated by dates, specific users, counters, or remote commands.
- Response tampering: phishing redirects, altered payments, unauthorized tracking.
- Tenant leaks: accessing another tenant’s records or sharing sensitive data through caches or global state.
- Background behavior: side effects in waitUntil(), streams, WebSockets, or delegated work.
- Resource abuse: request floods, recursive calls, unbounded retries, expensive queries or API calls.
- Concealed code: suspicious dependencies, encoded payloads, opaque WASM, or behavior absent from the readable source

DO NOT:
- attempt to fix issues
- attempt to run the code
- attempt to contact external services (eg. cloudflare API, other third party services) to test the security of the integration
  - you may contact github to fetch the integration code however (ideally, git clone a repo in a temporary directory)

## Step 3: Provide a report

For each finding provide:
- severity (levels. `critical`, `high`, `medium`, `low`),
- confidence (levels. `high`, `medium`, `low`),
- the source of the finding where applicable (what line of code or configuration triggered the finding)
- an explanation of the risk associated with the finding
  - Make sure the explanation is clear, concise, and understandable to junior developers.

Only show Critical & High severity findings to the user.

Verify counts, links, and claims before handing it off; do not publish or update an external tracker unless the user requested that action.
Do not include fix suggestions unless specifically intructed to.

## Step 4: Provide an overall security score and maliciousness rating

- Provide a security score from (not secure) 1 to 10 (very secure) or a range if you're unsure.
- Tell the user whether what you reviewed points to an intentionally malicious artifact, provide a score from (not malicious) 1 to 10 (very malicious), or a range if you're unsure.
