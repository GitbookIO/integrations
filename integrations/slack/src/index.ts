import { ChangedRevisionPage, RevisionSemanticChangeType } from '@gitbook/api';
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
        environment.spaceInstallation?.configuration?.channel ||
        environment.installation?.configuration.default_channel;

    if (!channel) {
        // Integration not yet configured.
        return;
    }

    if (environment.spaceInstallation?.configuration?.notify_content_update === false) {
        // Content updates are turned off
        return;
    }

    const [{ data: semanticChanges }, { data: space }] = await Promise.all([
        api.spaces.getRevisionSemanticChanges(event.spaceId, event.revisionId, {
            // Ignore git metadata changes
            metadata: false,
        }),
        api.spaces.getSpaceById(event.spaceId),
    ]);

    if (semanticChanges.changes.length === 0) {
        // No changes to notify about
        return;
    }

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

    const createdPages: ChangedRevisionPage[] = [];
    const editedPages: ChangedRevisionPage[] = [];
    const deletedPages: ChangedRevisionPage[] = [];
    const movedPages: ChangedRevisionPage[] = [];
    const createdFiles: string[] = [];
    const editedFiles: string[] = [];
    const deletedFiles: string[] = [];

    semanticChanges.changes.forEach((change) => {
        switch (change.type) {
            case RevisionSemanticChangeType.PageCreated:
                createdPages.push(change.page);
                break;
            case RevisionSemanticChangeType.PageEdited:
                editedPages.push(change.page);
                break;
            case RevisionSemanticChangeType.PageDeleted:
                deletedPages.push(change.page);
                break;
            case RevisionSemanticChangeType.PageMoved:
                movedPages.push(change.page);
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
        return list.map((item) => `• ${item}\n`).join('');
    };

    const renderPageList = (list: ChangedRevisionPage[]) => {
        return list.map((item) => `• <${space.urls.app}${item.path}|${item.title}>\n`).join('');
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
        if (createdPages.length > 0) {
            notificationText += `\n*New pages:*\n${renderPageList(createdPages)}\n\n`;
        }
        if (editedPages.length > 0) {
            notificationText += `\n*Modified pages:*\n${renderPageList(editedPages)}\n\n`;
        }
        if (deletedPages.length > 0) {
            notificationText += `\n*Deleted pages:*\n${renderPageList(deletedPages)}\n\n`;
        }
        if (movedPages.length > 0) {
            notificationText += `\n*Moved pages:*\n${renderPageList(movedPages)}\n\n`;
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

        if (semanticChanges.more && semanticChanges.more > 0) {
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

export default createIntegration({
    fetch: handleFetchEvent,

    events: {
        space_content_updated: handleSpaceContentUpdated,
    },
});
