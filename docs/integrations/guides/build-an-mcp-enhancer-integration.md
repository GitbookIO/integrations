---
description: Build a GitBook integration that augments docs with external MCP context
---

# Build an MCP enhancer integration

This guide shows how to build an integration that keeps GitBook as the authoring surface, while delegating advanced retrieval (for example: GitHub repos, websites, and external MCP endpoints) to your own backend service.

## Why this pattern

Many docs assistants only index content hosted directly in the docs platform. Teams often need additional context from:

- GitHub repositories
- External docs websites
- Internal runbooks
- Other MCP servers

An "MCP enhancer" integration lets you connect these sources through a managed backend while preserving GitBook as the front-door UX.

## Architecture

Use a split architecture:

1. **GitBook integration** for install/configuration UX and event handling.
2. **External backend** for indexing, source management, and MCP transport.
3. **Returned MCP endpoint** that clients can consume directly.

### Data flow

1. User installs the integration in GitBook.
2. Integration prompts user to connect an external account.
3. Integration sends space/site metadata to external backend.
4. External backend provisions an MCP endpoint and attaches GitBook as a source.
5. User adds more sources (repo, website, MCP URL) in the external app.
6. Clients query the returned MCP endpoint.

## Minimal manifest shape

```yaml
name: appa-mcp-enhancer
title: Appa MCP Enhancer
organization: your-org-id
visibility: private
description: Extend GitBook documentation context with external sources through MCP.
script: ./src/index.tsx
scopes: []
target: space
configurations:
  account:
    properties:
      connect_account:
        type: button
        title: Connect Appa
        description: Link your Appa account to manage additional MCP sources.
        button_text: Connect
        callback_url: /oauth
    required:
      - connect_account
```

## Runtime implementation checklist

- Use `createIntegration()` as entry point.
- Use `fetch()` routes for install and callback handling.
- Store installation-level identifiers in integration configuration.
- Forward only minimal metadata to external backend:
  - installation id
  - space/site ids
  - user/org ids needed for authorization
- Return actionable links (open external dashboard, copy endpoint, status).

## Security checklist

- Verify request origin/signature before processing webhooks.
- Encrypt tokens at rest on your backend.
- Rotate OAuth credentials and webhook secrets.
- Scope credentials to least privilege.
- Keep audit logs for installs, re-links, and source changes.

## Reliability checklist

- Make backend provisioning idempotent (safe retries).
- Queue long indexing jobs asynchronously.
- Expose indexing status for each source.
- Add dead-letter handling for failed ingestion events.

## Product UX checklist

- Make account linking explicit and reversible.
- Provide a single canonical MCP endpoint per workspace.
- Show source attribution for every response.
- Explain indexing expectations (pending, crawling, complete, error).

## Publishing notes

Before marketplace submission:

- set `visibility: public`
- provide icon, preview images, and external links
- include privacy policy and support links
- ensure all required metadata fields are present in `gitbook-manifest.yaml`

