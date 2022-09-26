import { GitLabRuntimeEnvironment, GitLabSpaceInstallationConfiguration } from './configuration';

const DEFAULT_GITLAB_HOST = 'https://gitlab.com';

export interface GitLabProject {
    id: string;
    name: string;
    path_with_namespace: string;
}

export interface GitLabProjectBranch {
    name: string;
    protected: boolean;
}

export type ListGitLabProjectsResponse = Array<GitLabProject>;
export type ListGitLabProjectBranchesResponse = Array<GitLabProjectBranch>;
export interface AddGitLabProjectHookResponse {
    id: number;
}
export type DeleteGitLabProjectHookResponse = null;
export interface UpdateGitLabProjectCommitStatus {
    name: string;
    sha: string;
    status: 'pending' | 'running' | 'success' | 'failure' | 'canceled';
}

type APIRequestMethod = 'GET' | 'POST' | 'DELETE';
type GitLabAPIResponse =
    | ListGitLabProjectsResponse
    | ListGitLabProjectBranchesResponse
    | AddGitLabProjectHookResponse
    | DeleteGitLabProjectHookResponse
    | UpdateGitLabProjectCommitStatus;

interface GitLabAPIRequestInput {
    method: APIRequestMethod;
    path: string;
    params?: Record<string, any>;
}

/**
 * Execute a GitLab API request.
 */
export async function executeGitLabAPIRequest<APIResponse extends GitLabAPIResponse>(
    input: GitLabAPIRequestInput,
    configuration: GitLabSpaceInstallationConfiguration
): Promise<APIResponse> {
    const { method, path, params } = input;
    const gitlabEndpoint = configuration.gitlab_host || DEFAULT_GITLAB_HOST;
    const url = new URL(`${gitlabEndpoint}/api/v4/${path}`);

    const headers: Record<string, string> = {
        Authorization: `Bearer ${configuration.auth_token}`,
    };

    let body;
    if (method === 'GET') {
        url.search = new URLSearchParams(params || {}).toString();
    } else {
        headers['Content-Type'] = 'application/json';
        body = params ? JSON.stringify(params) : undefined;
    }

    const response = await fetch(url.toString(), {
        method,
        headers,
        body,
    });

    if (!response.ok) {
        throw new Error(
            `GitLab API request ${method} ${url.toString()} failed - Error: ${response.text}`
        );
    }

    const raw = await response.text();
    return raw ? await response.json<APIResponse>() : null;
}

/**
 * Updates the commit status in GitLab.
 */
export async function updateGitLabProjectCommitStatus(
    project: string,
    commitSha: string,
    update: {
        context: string;
        description: string;
        state: 'running' | 'success' | 'failure';
        url: string;
    },
    configuration: GitLabSpaceInstallationConfiguration
) {
    await executeGitLabAPIRequest<UpdateGitLabProjectCommitStatus>(
        {
            method: 'POST',
            path: `/projects/${encodeURIComponent(project)}/statuses/${commitSha}`,
            params: {
                name: update.context,
                description: update.description,
                state: update.state,
                target_url: update.url,
            },
        },
        configuration
    );
}

/**
 * Returns the Git repo URL.
 */
export function getGitRepoURL(configuration: GitLabSpaceInstallationConfiguration) {
    const baseURL = getGitBaseURL(configuration);
    return `${baseURL}.git`;
}

/**
 * Returns the base URL of a Git installation in the provider.
 */
function getGitBaseURL(configuration: GitLabSpaceInstallationConfiguration): string {
    const hostname = configuration.gitlab_host || DEFAULT_GITLAB_HOST;
    return `${hostname}/${configuration.project}`;
}

/**
 * Returns the absolute URL for a commit.
 */
export function getGitCommitsURL(configuration: GitLabSpaceInstallationConfiguration): string {
    const base = getGitBaseURL(configuration);
    return `${base}/-/commit`;
}

/**
 * Return the base URL of the Git tree.
 */
export function getGitTreeURL(configuration: GitLabSpaceInstallationConfiguration): string {
    const prettyRef = configuration.ref.replace('refs/', '').replace('heads/', '');
    const base = getGitBaseURL(configuration);

    return `${base}/-/blob/${prettyRef}`;
}

/**
 * Return the Git repo URL with creds.
 */
export function getGitRepoAuthURL(configuration: GitLabSpaceInstallationConfiguration): string {
    const gitURL = getGitRepoURL(configuration);
    const repoUrl = new URL(gitURL);
    repoUrl.username = 'oauth2';
    repoUrl.password = configuration.auth_token;

    return repoUrl.toString();
}

/**
 * Return the cache ID to use during the syncs for the specific repo/installation.
 */
export function getRepoCacheID(environment: GitLabRuntimeEnvironment): string {
    const { spaceInstallation, installation } = environment;

    return `${installation.id}-${spaceInstallation.space}`;
}
