import { GitLabSpaceInstallationConfiguration } from './configuration';

const DEFAULT_GITLAB_HOST = 'https://gitlab.com';

/**
 * Execute a GitLab API request.
 */
export async function executeGitLabAPIRequest<GitLabAPIResponse>(
    method: 'GET' | 'POST' | 'DELETE',
    pathname: string,
    params: Record<string, any>,
    configuration: GitLabSpaceInstallationConfiguration
): Promise<GitLabAPIResponse> {
    const gitlabEndpoint = configuration.gitlab_host || DEFAULT_GITLAB_HOST;
    const url = new URL(`${gitlabEndpoint}/api/v4/${pathname}`);

    const headers: Record<string, string> = {
        Authorization: `Bearer ${configuration.auth_token}`,
    };

    let body;
    if (method === 'GET') {
        url.search = new URLSearchParams(params).toString();
    } else {
        headers['Content-Type'] = 'application/json';
        body = Object.keys(params).length > 0 ? JSON.stringify(params) : undefined;
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

    const data = await response.json<GitLabAPIResponse>();

    return data;
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
