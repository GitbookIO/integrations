import { Logger } from '@gitbook/runtime';

import { querySpaceInstallations } from './installation';
import { triggerImport } from './sync';
import { GitLabRuntimeContext, GitLabSpaceConfiguration } from './types';
import { computeConfigQueryKeyBase } from './utils';

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

const logger = Logger('gitlab:webhooks');

/**
 * Push on the main branch of an installation triggers a sync.
 */
export async function handlePushEvent(context: GitLabRuntimeContext, payload: GitLabPushEvent) {
    logger.info(`handling push event on ref "${payload.ref}" of "${payload.project.id}"`);

    const gitlabProjectId = payload.project.id;
    const gitlabRef = payload.ref;

    const queryKey = computeConfigQueryKeyBase(gitlabProjectId, gitlabRef);
    // Trigger import for all installations that match this repository
    const spaceInstallations = await querySpaceInstallations(context, queryKey);

    logger.info(
        `handling push event on ref "${payload.ref}" of "${payload.repository.id}" (project "${payload.project.id}"): ${spaceInstallations.length} space configurations are affected`
    );

    await Promise.all(
        spaceInstallations.map((spaceInstallation) => {
            return triggerImport(
                context,
                spaceInstallation.configuration as GitLabSpaceConfiguration
            );
        })
    );
}

/**
 * Push on pull-requests triggers an import to preview the changes.
 */
export async function handleMergeRequestEvent(
    context: GitLabRuntimeContext,
    payload: GitLabMergeRequestEvent
) {
    const gitlabProjectId = payload.project.id;
    const targetRef = `refs/heads/${payload.object_attributes.target_branch}`;
    const sourceRef = `refs/heads/${payload.object_attributes.source_branch}`;

    logger.info(
        `handling merge request event "${payload.object_attributes.action}" on ref "${targetRef}" of "${payload.project.id}"`
    );

    if (
        payload.object_attributes.action === 'open' ||
        payload.object_attributes.action === 'update'
    ) {
        const queryKey = computeConfigQueryKeyBase(gitlabProjectId, targetRef);
        // Trigger import for all installations that match this repository
        const spaceInstallations = await querySpaceInstallations(context, queryKey);

        logger.info(`
            handling merge request event "${payload.object_attributes.action}" on ref "${targetRef}" of "${payload.repository.id}" (project "${payload.project.id}"):
            ${spaceInstallations.length} space configurations are affected
            `);

        await Promise.all(
            spaceInstallations.map((spaceInstallation) => {
                return triggerImport(
                    context,
                    spaceInstallation.configuration as GitLabSpaceConfiguration,
                    {
                        standalone: {
                            ref: sourceRef,
                        },
                    }
                );
            })
        );
    } else {
        logger.info(`ignoring merge request event "${payload.object_attributes.action}"`);
    }
}