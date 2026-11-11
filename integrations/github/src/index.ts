import { createIntegration, Logger } from '@gitbook/runtime';

const logger = Logger('github');

/**
 * This integration has been retired: Git Sync with GitHub is built into GitBook.
 *
 * The integration stays published so that anything still pointing at it (GitHub App webhooks,
 * links to the OAuth or API endpoints, GitBook events and queued tasks) gets a clear answer,
 * but it does no work and keeps no state.
 */

const handleGitBookEvent = async (event: { type: string }) => {
    logger.debug(`ignoring "${event.type}" event: integration retired`);
};

export default createIntegration({
    fetch: async (request) => {
        logger.debug(
            `rejecting ${request.method} ${new URL(request.url).pathname}: integration retired`,
        );

        return new Response(JSON.stringify({ error: 'This integration has been retired.' }), {
            status: 410,
            headers: { 'content-type': 'application/json' },
        });
    },
    events: {
        installation_setup: handleGitBookEvent,
        space_installation_setup: handleGitBookEvent,
        space_installation_deleted: handleGitBookEvent,
        space_content_updated: handleGitBookEvent,
        space_gitsync_started: handleGitBookEvent,
        space_gitsync_completed: handleGitBookEvent,
    },
    task: async () => {
        logger.debug('ignoring task: integration retired');
    },
});
