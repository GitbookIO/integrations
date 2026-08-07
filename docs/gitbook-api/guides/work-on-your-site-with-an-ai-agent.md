---
description: Use a coding agent and GitBook skills to update your documentation.
---

# Work on your site with an AI agent

Use a coding agent with GitBook skills to plan and make a reviewable site update.

### Before you begin

You need:

* A coding agent that supports Agent Skills.
* The GitBook CLI installed and signed in.
* Access to the GitBook organization and site you want to update.

### Install the GitBook skills

From the repository where you work with your agent, run:

```bash
npx skills add GitbookIO/gitbook-skills
```

The installed skills give your agent GitBook-specific instructions.

See the [GitBook skills repository](https://github.com/GitbookIO/gitbook-skills) for available skills.

### Give the agent a focused task

In your agent, enter a request like this:

```
Use the GitBook skills to review our site’s getting-started content.
Propose updates for outdated setup steps.
Create a change request for review. Do not merge it.
```

Name the site, space, pages, and desired outcome in your prompt.

Ask the agent to create a change request when you need review before publishing.

### Review the proposed changes

Open the generated change request in GitBook.

Check its diff, links, and examples. Merge it when the update is ready to publish.

### Continue building

Use the same workflow for larger changes:

* Create a new space or site.
* Update related pages in one change request.
* Identify broken links or incomplete setup steps.
