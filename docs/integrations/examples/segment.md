---
description: Tutorial to write a complete Segment integration from scratch.
---

# Segment

{% hint style="warning" %}
The GitBook Integration Platform is currently in **alpha**. It's not opened to developers just yet.
{% endhint %}

This tutorial will guide you in creating an integration tracking specific events happening in GitBook into a [Segment.com](https://segment.com) destination.

For a complete code reference, you can check out the official Segment.com integration: [https://github.com/GitbookIO/integrations/tree/main/integrations/segment](https://github.com/GitbookIO/integrations/tree/main/integrations/segment)

## Step 1: create the integration

After following the [Quickstart](../../quickstart.md) guide to install and configure the GitBook CLI, you can create a new integration:

```
gitbook new ./my-segment
```

The CLI will prompt you to enter a title and to select scopes, choose the scopes `space:views` to ensure the integration can listen to the `space:view` event.

## Step 2: define the configuration



## Step 3: track events from GitBook
