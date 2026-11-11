import { createIntegration, Logger } from '@gitbook/runtime';

const logger = Logger('github');

/**
 * This integration has been retired: Git Sync with GitHub is built into GitBook.
 *
 * The integration stays published so that anything still pointing at it (GitHub App webhooks,
 * links to the OAuth or API endpoints, installation events and queued tasks) gets a clear answer,
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
    /**
     * With no scopes, GitBook only sends the installation lifecycle events, which need none.
     */
    events: {
        installation_setup: handleGitBookEvent,
        installation_deleted: handleGitBookEvent,
        space_installation_setup: handleGitBookEvent,
        space_installation_deleted: handleGitBookEvent,
    },
    task: async () => {
        logger.debug('ignoring task: integration retired');
    },
});
