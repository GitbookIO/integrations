import { GitLabConfiguration } from './types';

const DEFAULT_GITLAB_HOST = 'https://gitlab.com';
/**
 * Execute a GitLab API request.
 */
export async function executeGitLabAPIRequest(
    method: 'GET' | 'POST' | 'DELETE',
    pathname: string,
    params: Record<string, any>,
    config: GitLabConfiguration
) {
    const gitlabEndpoint = config.gitlabHost || DEFAULT_GITLAB_HOST;
    const url = new URL(`${gitlabEndpoint}/api/v4/${pathname}`);

    const headers: Record<string, string> = {
        Authorization: `Bearer ${config.authToken}`,
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

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            `GitLab API request ${method} ${url.toString()} failed - Error: ${data.message}`
        );
    }

    return data;
}
