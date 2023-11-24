import { RevisionSemanticChangeType } from '@gitbook/api';
import { createIntegration, EventCallback } from '@gitbook/runtime';

import { SlackRuntimeContext } from './configuration';
import { handleFetchEvent } from './router';
import { slackAPI } from './slack';
import { Spacer } from './ui';

/*
 * Handle content being updated: send a notification on Slack.
 */
const handleSpaceContentUpdated: EventCallback<
    'space_content_updated',
    SlackRuntimeContext
> = async (event, context) => {
    const { environment, api } = context;
    const channel =
        environment.spaceInstallation.configuration.channel ||
        environment.installation.configuration.default_channel;

    if (!channel) {
        // Integration not yet configured.
        return;
    }

    if (environment.spaceInstallation.configuration.notify_content_update === false) {
        // Content updates are turned off
        return;
    }

    const { data: semanticChanges } = await api.spaces.getRevisionSemanticChanges(
        event.spaceId,
        event.revisionId,
        {
            // Ignore git metadata and custom field changes
            metadata: false,
        }
    );

    if (semanticChanges.changes.length === 0) {
        // No changes to notify about
        return;
    }

    const { data: space } = await api.spaces.getSpaceById(event.spaceId);

    /*
     * Build a notification that looks something like this:
     *
     *    Content of *Space* has been updated.
     *
     *    Summary of changes:
     *    • New pages: Page1, Page2
     *    • Modified pages: Page3
     *    • Deleted pages: Page4, Page5
     *    • Moved pages: Page6
     *    • New files: File1, File2
     *    • Modified files: File3
     *    • Deleted files: File4
     *
     *    And another X changes not listed here.
     */

    const createdPages = [];
    const editedPages = [];
    const deletedPages = [];
    const movedPages = [];
    const createdFiles = [];
    const editedFiles = [];
    const deletedFiles = [];

    semanticChanges.changes.forEach((change) => {
        switch (change.type) {
            case RevisionSemanticChangeType.PageCreated:
                createdPages.push(change.page.title);
                break;
            case RevisionSemanticChangeType.PageEdited:
                editedPages.push(change.page.title);
                break;
            case RevisionSemanticChangeType.PageDeleted:
                deletedPages.push(change.page.title);
                break;
            case RevisionSemanticChangeType.PageMoved:
                movedPages.push(change.page.title);
                break;
            case RevisionSemanticChangeType.FileCreated:
                createdFiles.push(change.file.name);
                break;
            case RevisionSemanticChangeType.FileEdited:
                editedFiles.push(change.file.name);
                break;
            case RevisionSemanticChangeType.FileDeleted:
                deletedFiles.push(change.file.name);
                break;
            default:
                break;
        }
    });

    let notificationText = `Content of *<${space.urls.app}|${
        space.title || 'Space'
    }>* has been updated.`;

    const renderList = (list: string[]) => {
        return list.map((item) => `• ${item}\n`);
    };

    if (
        createdPages.length > 0 ||
        editedPages.length > 0 ||
        deletedPages.length > 0 ||
        movedPages.length > 0 ||
        createdFiles.length > 0 ||
        editedFiles.length > 0 ||
        deletedFiles.length > 0
    ) {
        // notificationText += '\n\n*Summary of changes:*';

        if (createdPages.length > 0) {
            notificationText += `\n*New pages:*\n${renderList(createdPages)}\n\n`;
        }
        if (editedPages.length > 0) {
            notificationText += `\n*Modified pages:*\n${renderList(editedPages)}\n\n`;
        }
        if (deletedPages.length > 0) {
            notificationText += `\n*Deleted pages:*\n${renderList(deletedPages)}\n\n`;
        }
        if (movedPages.length > 0) {
            notificationText += `\n*Moved pages:*\n${renderList(movedPages)}\n\n`;
        }
        if (createdFiles.length > 0) {
            notificationText += `\n*New files:*\n${renderList(createdFiles)}\n\n`;
        }
        if (editedFiles.length > 0) {
            notificationText += `\n*Modified files:*\n${renderList(editedFiles)}\n\n`;
        }
        if (deletedFiles.length > 0) {
            notificationText += `\n*Deleted files:*\n${renderList(deletedFiles)}\n\n`;
        }

        if (semanticChanges.more > 0) {
            notificationText += `\n\nAnd another ${semanticChanges.more} changes not listed here.\n`;
        }
    }

    await slackAPI(context, {
        method: 'POST',
        path: 'chat.postMessage',
        payload: {
            channel,
            blocks: [
                Spacer,
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: notificationText,
                    },
                },
                Spacer,
            ],
        },
    });
};

/*
 * Handle content visibility being updated: send a notification on Slack.
 */
const handleSpaceVisibilityUpdated: EventCallback<
    'space_visibility_updated',
    SlackRuntimeContext
> = async (event, context) => {
    const { environment, api } = context;

    const channel =
        environment.spaceInstallation.configuration.channel ||
        environment.installation.configuration.default_channel;

    if (!channel) {
        // Integration not yet configured on a channel
        return;
    }

    if (environment.spaceInstallation.configuration.notify_visibility_update === false) {
        // Visibility updates are turned off
        return;
    }

    const { spaceId, previousVisibility, visibility } = event;

    const { data: space } = await api.spaces.getSpaceById(spaceId);

    await slackAPI(context, {
        method: 'POST',
        path: 'chat.postMessage',
        payload: {
            channel,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `The visibility of *<${space.urls.app}|${
                            space.title || 'Space'
                        }>* has been changed from *${previousVisibility}* to *${visibility}*`,
                    },
                },
            ],
        },
    });
};

export default createIntegration({
    fetch: handleFetchEvent,

    events: {
        space_content_updated: handleSpaceContentUpdated,
        space_visibility_updated: handleSpaceVisibilityUpdated,
    },
});
