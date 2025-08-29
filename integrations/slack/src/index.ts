import { ChangedRevisionPage, RevisionSemanticChangeType } from '@gitbook/api';
import { createIntegration, EventCallback } from '@gitbook/runtime';

import { SlackRuntimeContext } from './configuration';
import { handleFetchEvent } from './router';
import { slackAPI } from './slack';
import { TBlock, TButtonElement } from './types';

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

    const MAX_ITEMS_TO_SHOW = 5;

    const createChangeSection = (
        title: string,
        items: string[] | ChangedRevisionPage[],
        emoji: string,
    ): TBlock[] => {
        if (items.length === 0) return [];

        const displayItems = items.slice(0, MAX_ITEMS_TO_SHOW);
        const remainingCount = items.length - displayItems.length;

        let text = `${emoji} *${title}*\n`;
        displayItems.forEach((item) => {
            if (typeof item === 'string') {
                text += `• ${item}\n`;
            } else {
                // Page object with URL
                const pageUrl = `${space.urls.published || space.urls.app}${item.path || ''}`;
                text += `• <${pageUrl}|${item.title}>\n`;
            }
        });

        if (remainingCount > 0) {
            text += `_and ${remainingCount} more..._`;
        }

        return [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: text.trim(),
                },
            },
        ];
    };

    const getEmojiFromUnicode = (unicodeHex: string) => {
        if (!unicodeHex) return '✨';
        try {
            // Convert hex string to actual emoji
            const codePoint = parseInt(unicodeHex, 16);
            return String.fromCodePoint(codePoint);
        } catch {
            return '✨';
        }
    };

    const spaceEmoji = space.emoji ? getEmojiFromUnicode(space.emoji) : '✨';

    const blocks: TBlock[] = [
        {
            type: 'header',
            text: {
                type: 'plain_text',
                text: `${spaceEmoji} ${space.title || 'Space'} Updated`,
                emoji: true,
            },
        },
    ];

    let changeRequest;
    if (semanticChanges.mergedFrom) {
        changeRequest = semanticChanges.mergedFrom;
        blocks.push({
            type: 'context',
            elements: [
                {
                    type: 'mrkdwn',
                    text: `🔀 Changes were merged from change request: <${changeRequest.urls.app}|#${changeRequest.number}${changeRequest.subject ? ` - ${changeRequest.subject}` : ''}>`,
                },
            ],
        });
    }

    blocks.push({
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: '*Summary of Changes:*',
        },
    });

    blocks.push(...createChangeSection('New pages', createdPages, '🆕'));
    blocks.push(...createChangeSection('Modified pages', editedPages, '📝'));
    blocks.push(...createChangeSection('Deleted pages', deletedPages, '🗑️'));
    blocks.push(...createChangeSection('Moved pages', movedPages, '📁'));
    blocks.push(...createChangeSection('New files', createdFiles, '📄'));
    blocks.push(...createChangeSection('Modified files', editedFiles, '📝'));
    blocks.push(...createChangeSection('Deleted files', deletedFiles, '🗂️'));

    if (semanticChanges.more && semanticChanges.more > 0) {
        blocks.push({
            type: 'context',
            elements: [
                {
                    type: 'mrkdwn',
                    text: `➕ _And ${semanticChanges.more} additional changes not listed here_`,
                },
            ],
        });
    }

    const actionButtons: TButtonElement[] = [
        {
            type: 'button',
            text: {
                type: 'plain_text',
                text: '🏠 View Main Space',
                emoji: true,
            },
            url: space.urls.app,
            action_id: 'view_main_space',
            style: 'primary',
        },
    ];

    if (space.urls.published) {
        actionButtons.push({
            type: 'button',
            text: {
                type: 'plain_text',
                text: '🌐 View Docs Site',
                emoji: true,
            },
            url: space.urls.published,
            action_id: 'view_docs_site',
        });
    }

    blocks.push({ type: 'divider' });

    // Add a nice footer section
    const totalChanges =
        createdPages.length +
        editedPages.length +
        deletedPages.length +
        movedPages.length +
        createdFiles.length +
        editedFiles.length +
        deletedFiles.length +
        (semanticChanges.more || 0);

    blocks.push({
        type: 'context',
        elements: [
            {
                type: 'mrkdwn',
                text: `📊 *${totalChanges} total changes* • Updated just now`,
            },
        ],
    });

    blocks.push({
        type: 'actions',
        elements: actionButtons,
    });

    await slackAPI(context, {
        method: 'POST',
        path: 'chat.postMessage',
        payload: {
            channel,
            blocks,
            unfurl_links: false,
            unfurl_media: false,
        },
    });
};

export default createIntegration({
    fetch: handleFetchEvent,

    events: {
        space_content_updated: handleSpaceContentUpdated,
    },
});
