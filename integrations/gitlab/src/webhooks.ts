import { Logger } from '@gitbook/runtime';

import { handleImportDispatchForSpaces } from './tasks';
import { GitLabRuntimeContext } from './types';
import { computeConfigQueryKey } from './utils';

interface GitLabCommit {
    id: string;
    message: string;
    title: string;
    timestamp: string;
    url: string;
    author: {
        name: string;
        email: string;
    };
    added: string[];
    modified: string[];
    removed: string[];
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
    commits: GitLabCommit[];
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
    const gitlabProjectId = payload.project.id;
    const gitlabRef = payload.ref;

    logger.info(
        `handling push event on ref "${payload.ref}" of "${payload.repository.id}" (project "${payload.project.id}")`,
    );

    const queryKey = computeConfigQueryKey(gitlabProjectId, gitlabRef);

    // Gitlab push events do not include a head_commit property so we need to get it from
    // the commits attribute which should contains the newest 20 commits:
    // https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#push-events
    const headCommitSha = payload.after;
    const headCommit = payload.commits.find((commit) => commit.id === headCommitSha);

    const total = await handleImportDispatchForSpaces(context, {
        configQuery: queryKey,
        eventTimestamp: headCommit?.timestamp ? new Date(headCommit.timestamp) : undefined,
    });

    logger.debug(`${total} space configurations are affected`);
}

/**
 * Push on pull-requests triggers an import to preview the changes.
 */
export async function handleMergeRequestEvent(
    context: GitLabRuntimeContext,
    payload: GitLabMergeRequestEvent,
) {
    const gitlabProjectId = payload.project.id;
    const targetRef = `refs/heads/${payload.object_attributes.target_branch}`;
    const sourceRef = `refs/heads/${payload.object_attributes.source_branch}`;

    logger.info(
        `handling merge request event "${payload.object_attributes.action}" on ref "${targetRef}" of "${payload.project.id}"`,
    );

    if (
        payload.object_attributes.action === 'open' ||
        payload.object_attributes.action === 'update'
    ) {
        logger.info(`
          handling merge request event "${payload.object_attributes.action}" on ref "${targetRef}" of "${payload.repository.id}" (project "${payload.project.id}")
        `);

        const queryKey = computeConfigQueryKey(gitlabProjectId, targetRef);

        const total = await handleImportDispatchForSpaces(context, {
            configQuery: queryKey,
            standaloneRef: sourceRef,
        });

        logger.debug(`${total} space configurations are affected`);
    } else {
        logger.info(`ignoring merge request event "${payload.object_attributes.action}"`);
    }
}
