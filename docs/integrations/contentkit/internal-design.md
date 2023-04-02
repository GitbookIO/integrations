# Internal design

ContentKits solves the problem: **"How can we empower external developers to build UI in GitBook?"**, with specific goals:

* Ensuring high-level security: integrations should extend the GitBook UI without having access to browser's context or data they are not granted access to.
* Ensuring a consistent UI quality: integrations should extend the GitBook UI with a look and feel that is consistent with the rest of the application
* Be platform agnostic: integration's UI should run on all browsers and should be compatible with future mobile applications

## Inspirations

Similar concepts:

* [Slack Block Kit](https://api.slack.com/block-kit)
* [Intercom Canvas Kit](https://developers.intercom.com/building-apps/docs/canvas-kit)

Design inspirations:

* **React**: for UI definition and declarative approach
* **React Native**: for naming of components
* **Swift UI**: for layout definitions (spacer, divider, stacks)
