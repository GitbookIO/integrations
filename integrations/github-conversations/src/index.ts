import { createIntegration, createOAuthHandler } from '@gitbook/runtime';
import { GitHubRuntimeContext } from './types';
import { configComponent } from './config';
import { getGitHubClient, getGitHubOAuthConfig } from './client';
import {
    ingestDiscussions,
    parseDiscussionAsConversation,
    GitHubDiscussion,
    DISCUSSION_QUERY,
} from './conversations';

export default createIntegration<GitHubRuntimeContext>({
    fetch: async (request, context) => {
        const url = new URL(request.url);

        if (url.pathname.endsWith('/webhook')) {
            const payload = await request.json<any>();
            if (payload.action === 'closed' || payload.action === 'answered') {
                const { installation } = context.environment;
                if (!installation) {
                    throw new Error('Installation not found');
                }
                const client = await getGitHubClient(context);
                const repo = installation.configuration.repository;
                if (!repo) {
                    throw new Error('Repository not configured');
                }
                const [owner, name] = repo.split('/');
                const result = await client.graphql<any>(DISCUSSION_QUERY, {
                    owner,
                    repo: name,
                    number: payload.discussion.number,
                });
                const discussion: GitHubDiscussion = result.repository.discussion;
                const conversation = await parseDiscussionAsConversation(discussion);
                await context.api.orgs.ingestConversation(installation.target.organization, [conversation]);
            }
            return new Response('OK', { status: 200 });
        }

        if (url.pathname.endsWith('/oauth')) {
            const handler = createOAuthHandler(getGitHubOAuthConfig(context), {
                replace: false,
            });
            return handler(request, context);
        }

        return new Response('Not found', { status: 404 });
    },
    components: [configComponent],
    events: {
        installation_setup: async (event, context) => {
            const { installation } = context.environment;
            if (installation?.configuration.repository && installation?.configuration.oauth_credentials) {
                const client = await getGitHubClient(context);
                await ingestDiscussions(client, installation.configuration.repository, async (conversations) => {
                    await context.api.orgs.ingestConversation(installation.target.organization, conversations);
                });
            }
        },
    },
});
