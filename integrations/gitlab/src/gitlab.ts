import { GitLabSpaceInstallationConfiguration } from './configuration';

const DEFAULT_GITLAB_HOST = 'https://gitlab.com';

export interface GitLabProjects {
    id: string;
    name: string;
}

export interface GitLabProjectBranches {
    name: string;
    protected: boolean;
}

export type ListGitLabProjectsResponse = Array<GitLabProjects>;
export type ListGitLabProjectBranchesResponse = Array<GitLabProjectBranches>;
export interface AddGitLabProjectHookResponse {
    id: number;
}
export type DeleteGitLabProjectHookResponse = null;

type APIRequestMethod = 'GET' | 'POST' | 'DELETE';
type GitLabAPIResponse =
    | ListGitLabProjectsResponse
    | ListGitLabProjectBranchesResponse
    | AddGitLabProjectHookResponse
    | DeleteGitLabProjectHookResponse;

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
 * Returns the base URL of a Git installation in the provider.
 */
function getGitBaseURL(
    basePath: string,
    configuration: GitLabSpaceInstallationConfiguration
): string {
    const hostname = configuration.gitlab_host || DEFAULT_GITLAB_HOST;
    return `${hostname}/${basePath}`;
}

/**
 * Returns the absolute URL for a commit.
 */
export function getGitCommitsURL(
    basePath: string,
    configuration: GitLabSpaceInstallationConfiguration
): string {
    const base = getGitBaseURL(basePath, configuration);
    return `${base}/-/commit`;
}

/**
 * Return the base URL of the Git tree.
 */
export function getGitTreeURL(
    basePath: string,
    configuration: GitLabSpaceInstallationConfiguration
): string {
    const prettyRef = configuration.ref.replace('refs/', '').replace('heads/', '');
    const base = getGitBaseURL(basePath, configuration);

    return `${base}/-/blob/${prettyRef}`;
}

/**
 * Return the Git repo URL with creds.
 */
export function getGitRepoAuthURL(
    gitURL: string,
    configuration: GitLabSpaceInstallationConfiguration
): string {
    const repoUrl = new URL(gitURL);
    repoUrl.username = 'oauth2';
    repoUrl.password = configuration.auth_token;

    return repoUrl.toString();
}
