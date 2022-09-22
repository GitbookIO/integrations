import { Router } from 'itty-router';

import { FetchEventCallback } from '@gitbook/runtime';

import { GitLabRuntimeContext, GitLabRuntimeEnvironment } from './configuration';
import { executeGitLabAPIRequest } from './gitlab';
import { createGitLabWebhookHandler } from './webhooks';

/**
 * Handle the integration's incoming HTTP requests:
 * - Installation UI completion requests
 * - GitLab webhook requests.
 */
export const handleFetchEvent: FetchEventCallback<GitLabRuntimeContext> = async (
    { request },
    context
) => {
    const { environment } = context;
    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint
        ).pathname,
    });

    /**
     *
     */
    router.get('/projects', async () => listGitLabProjects(environment));
    router.get('/branches', async () => listGitLabProjectBranches(environment));
    router.post('/webhook', createGitLabWebhookHandler(context));

    const response = await router.handle(request, context);
    if (!response) {
        return new Response(`No route matching`, { status: 404 });
    }

    return response;
};

/**
 * List all GitLab projects accessible by the current auth token.
 */
export async function listGitLabProjects(environment: GitLabRuntimeEnvironment) {
    const { configuration } = environment.spaceInstallation;

    if (!configuration?.auth_token) {
        return new Response('No auth token provided', {
            status: 400,
        });
    }

    const data = await executeGitLabAPIRequest(
        'GET',
        'projects',
        { membership: true },
        configuration
    );

    const projects = data.map((project) => {
        return {
            label: project.name,
            value: `${project.id}`,
        };
    });

    return new Response(JSON.stringify(projects), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

/**
 * List all branches associated with the selected project.
 */
export async function listGitLabProjectBranches(environment: GitLabRuntimeEnvironment) {
    const { configuration } = environment.spaceInstallation;

    if (!configuration?.project || !configuration?.auth_token) {
        return new Response('No GitLab project or auth token provided', {
            status: 400,
        });
    }

    const data = await executeGitLabAPIRequest(
        'GET',
        `projects/${configuration.project}/repository/branches`,
        {},
        configuration
    );

    const branches = data.map((branch) => {
        return {
            label: branch.name + (branch.protected ? ' (protected)' : ''),
            value: `refs/heads/${branch.name}`,
        };
    });

    return new Response(JSON.stringify(branches), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
