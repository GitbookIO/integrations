import { Request } from 'itty-router';

import { RequestImportGitRepository } from '@gitbook/api';

import {
    GitLabRuntimeContext,
    GitLabRuntimeEnvironment,
    GitLabSpaceInstallationConfiguration,
} from './configuration';
import {
    executeGitLabAPIRequest,
    getGitCommitsURL,
    getGitRepoAuthURL,
    getGitTreeURL,
} from './gitlab';

enum GitLabEventName {
    PUSH_HOOK = 'Push Hook',
    MERGE_REQUEST_HOOK = 'Merge Request Hook',
}

interface GitLabProject {
    name: string;
    description: string;
    web_url: string;
    avatar_url: string;
    git_ssh_url: string;
    git_http_url: string;
    namespace: string;
    visibility_level: number;
    path_with_namespace: string;
    default_branch: string;
    homepage: string;
    url: string;
    ssh_url: string;
    http_url: string;
    id: number;
}

interface GitLabPushEvent {
    object_kind: string;
    before: string;
    after: string;
    ref: string;
    checkout_sha: string;
    user_id: number;
    user_name: string;
    user_username: string;
    user_email: string;
    user_avatar: string;
    project_id: number;
    project: GitLabProject;
    repository: any;
    commits: any[];
    total_commits_count: number;
}

interface GitLabMergeRequestEvent {
    object_kind: string;
    user: any;
    project: GitLabProject;
    repository: any;
    object_attributes: {
        id: number;
        target_branch: string;
        source_branch: string;
        source_project_id: number;
        author_id: number;
        assignee_id: number;
        title: string;
        created_at: string;
        updated_at: string;
        milestone_id: null;
        state: string;
        merge_status: string;
        target_project_id: number;
        iid: number;
        description: string;
        source: GitLabProject;
        target: GitLabProject;
        last_commit: any;
        work_in_progress: boolean;
        url: string;
        action: string;
        assignee: any;
    };
    labels: any[];
    changes: any;
}

/**
 * Create the GitLab Webhook event handler.
 */
export function createGitLabWebhookHandler(
    context: GitLabRuntimeContext
): (request: Request) => Promise<Response> {
    return async (request: Request) => {
        // @ts-ignore
        const eventName = request.headers.get('X-Gitlab-Event');

        try {
            switch (eventName) {
                case GitLabEventName.PUSH_HOOK:
                    const pushHookEvent: GitLabPushEvent = await request.json();
                    return await handleGitLabPushHookEvent(pushHookEvent, context);
                case GitLabEventName.MERGE_REQUEST_HOOK:
                    const mergeRequestEvent: GitLabMergeRequestEvent = await request.json();
                    return await handleGitLabMergeRequestEvent(mergeRequestEvent, context);
                default:
                    return sendIgnoreResponse();
            }
        } catch (error) {
            return new Response(JSON.stringify({ status: 'error', message: error.message }), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    };
}

function sendIgnoreResponse() {
    return new Response(JSON.stringify({ status: 'ignored' }), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

function getRepoCacheID(environment: GitLabRuntimeEnvironment): string {
    const { spaceInstallation, installation } = environment;

    return `${installation.id}-${spaceInstallation.space}`;
}

/**
 * Handle a Push Hook event from GitBook by triggering a Git sync import.
 */
async function handleGitLabPushHookEvent(
    event: GitLabPushEvent,
    context: GitLabRuntimeContext
): Promise<Response> {
    const { environment } = context;
    const { spaceInstallation } = environment;

    console.info(`Handling GitLab push event on ref "${event.ref}" of "${event.project.id}"`);

    const { configuration } = spaceInstallation;

    // Ignore when the event ref doesn't match the ref configured for the Space installation.
    if (event.ref !== configuration.ref) {
        return sendIgnoreResponse();
    }

    // Trigger a Git sync import.
    const importRequest: RequestImportGitRepository = {
        url: getGitRepoAuthURL(event.project.git_http_url, configuration),
        ref: event.ref,
        repoCacheID: getRepoCacheID(environment),
        repoCommitURL: getGitCommitsURL(event.project.path_with_namespace, configuration),
        repoTreeURL: getGitTreeURL(event.project.path_with_namespace, configuration),
    };

    api.spaces.importGitRepository(spaceInstallation.space, importRequest);

    return new Response(JSON.stringify({ status: 'success' }), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

/**
 * Handle a Merge Request event from GitBook by triggering a Git sync standalone import (Main Space content not updated).
 */
async function handleGitLabMergeRequestEvent(
    event: GitLabMergeRequestEvent,
    context: GitLabRuntimeContext
): Promise<Response> {
    const { environment } = context;
    const { spaceInstallation } = environment;
    const { configuration } = spaceInstallation;

    // Only start the import on open and update Merge Request actions.
    if (!['open', 'update'].includes(event.object_attributes.action)) {
        return sendIgnoreResponse();
    }

    // Ignore when the Space installation doesn't have Fork PR preview enabled.
    if (!configuration.fork_pr_preview) {
        return sendIgnoreResponse();
    }

    const targetRef = `refs/heads/${event.object_attributes.target_branch}`;
    const sourceRef = `refs/heads/${event.object_attributes.source_branch}`;

    // Ignore when the target ref doesn't match the ref configured for the Space installation.
    if (targetRef !== configuration.ref) {
        return sendIgnoreResponse();
    }

    console.info(
        `Handling GitLab merge request event "${event.object_attributes.action}" on ref "${targetRef}" of "${event.project.id}"`
    );

    // Trigger a Git sync standalone import.
    const importRequest: RequestImportGitRepository = {
        url: getGitRepoAuthURL(event.project.git_http_url, configuration),
        ref: sourceRef,
        repoCacheID: getRepoCacheID(environment),
        repoCommitURL: getGitCommitsURL(event.project.path_with_namespace, configuration),
        repoTreeURL: getGitTreeURL(event.project.path_with_namespace, configuration),
        standalone: true,
    };

    api.spaces.importGitRepository(spaceInstallation.space, importRequest);

    return new Response(JSON.stringify({ status: 'success' }), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export function validateGitLabWebhookRequest(request) {
    // TODO: is it worth implementing?
    // See:
    //   - https://docs.gitlab.com/ee/user/project/integrations/webhooks.html#validate-payloads-by-using-a-secret-token
    //   - https://gitlab.com/gitlab-org/gitlab/-/issues/19367
}

/**
 * Add a webhook to the GitLab project.
 */
export async function installGitLabWebhook(
    webhookURL: string,
    configuration: GitLabSpaceInstallationConfiguration
): Promise<number> {
    const data = await executeGitLabAPIRequest(
        'POST',
        `projects/${configuration.project}/hooks`,
        {
            url: webhookURL,
            push_events: true,
            merge_requests_events: true,
        },
        configuration
    );

    return data.id;
}

/**
 * Remove a webhook from the GitLab project.
 */
export async function uninstallGitLabWebhook(
    hookId: number,
    configuration: GitLabSpaceInstallationConfiguration
): Promise<void> {
    await executeGitLabAPIRequest(
        'DELETE',
        `projects/${configuration.project}/hooks/${hookId}`,
        {},
        configuration
    );
}
