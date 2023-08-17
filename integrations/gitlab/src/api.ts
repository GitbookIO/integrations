import httpError from 'http-errors';
import LinkHeader from 'http-link-header';

import type { GitLabSpaceConfiguration } from './types';

/**
 * NOTE: These GL types are not complete, they are just what we need for now.
 */

interface GLProject {
    id: number;
    name: string;
    name_with_namespace: string;
    visibility: 'public' | 'private' | 'internal';
}

interface GLBranch {
    name: string;
    protected: boolean;
}

/**
 * Fetch all projects for the current GitLab authentication. It will use
 * the access token from the environment.
 */
export async function fetchProjects(config: GitLabSpaceConfiguration) {
    const projects = await fetchGitLabAPI<Array<GLProject>>(config, {
        path: '/projects',
        params: {
            membership: true,
            per_page: 100,
            page: 1,
        },
    });

    return projects;
}

/**
 * Fetch all branches for a given project repository.
 */
export async function fetchProjectBranches(config: GitLabSpaceConfiguration, projectId: number) {
    const branches = await fetchGitLabAPI<Array<GLBranch>>(config, {
        path: `/projects/${projectId}/repository/branches`,
        params: {
            per_page: 100,
            page: 1,
        },
    });

    return branches;
}

/**
 * Configure a GitLab webhook for a given project.
 */
export async function addProjectWebhook(
    config: GitLabSpaceConfiguration,
    projectId: number,
    webhook: string
) {
    const { id } = await fetchGitLabAPI<{ id: number }>(config, {
        method: 'POST',
        path: `/projects/${projectId}/hooks`,
        body: {
            url: webhook,
            push_events: true,
            merge_requests_events: true,
        },
    });

    return id;
}

/**
 * Delete a GitLab webhook for a given project.
 */
export async function deleteProjectWebhook(
    config: GitLabSpaceConfiguration,
    projectId: number,
    webhookId: number
) {
    await fetchGitLabAPI(config, {
        method: 'DELETE',
        path: `/projects/${projectId}/hooks/${webhookId}`,
    });
}

/**
 * Create a commit status for a commit SHA.
 */
export async function editCommitStatus(
    config: GitLabSpaceConfiguration,
    projectId: number,
    sha: string,
    status: object
): Promise<void> {
    await fetchGitLabAPI(config, {
        method: 'POST',
        path: `/projects/${projectId}/statuses/${sha}`,
        body: status,
    });
}

/**
 * Execute a GitLab API request.
 */
export async function fetchGitLabAPI<T>(
    config: GitLabSpaceConfiguration,
    request: {
        method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
        path: string;
        body?: object;
        params?: object;
        /** Property to get an array for pagination */
        listProperty?: string;
    }
): Promise<T> {
    const { method = 'GET', path, body, params, listProperty = '' } = request;

    const endpoint = getEndpoint(config);
    const token = getAccessToken(config);

    const baseEndpoint = `${endpoint || 'https://gitlab.com'}/api/v4`;

    const url = new URL(`${baseEndpoint}${path}`);
    Object.entries(params || {}).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });
    const options = {
        method,
        body: body ? JSON.stringify(body) : undefined,
    };

    const response = await requestGitLab(url, token, options);

    let data = await response.json();

    let paginatedListProperty = false;
    if (listProperty) {
        // @ts-ignore
        data = data[listProperty];
        paginatedListProperty = true;
    }

    // Pagination
    let res = response;
    while (res.headers.has('Link')) {
        const link = LinkHeader.parse(res.headers.get('Link') || '');
        if (link.has('rel', 'next')) {
            const nextURL = new URL(link.get('rel', 'next')[0].uri);
            const nextURLSearchParams = Object.fromEntries(nextURL.searchParams);
            if (nextURLSearchParams.page) {
                url.searchParams.set('page', nextURLSearchParams.page as string);
                const nextResponse = await requestGitLab(url, token, options);
                const nextData = await nextResponse.json();
                // @ts-ignore
                data = [...data, ...(paginatedListProperty ? nextData[listProperty] : nextData)];
                res = nextResponse;
            }
        } else {
            break;
        }
    }

    return data as T;
}

/**
 * Execute the GitLab API request using the given token credentials
 * It will throw an error if the response is not ok.
 */
async function requestGitLab(
    url: URL,
    token: string,
    options: RequestInit = {}
): Promise<Response> {
    const response = await fetch(url.toString(), {
        ...options,
        headers: {
            ...options.headers,
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'User-Agent': 'GitLab-Integration-Worker',
        },
    });

    if (!response.ok) {
        throw httpError(response.status, `GitLab API error: ${response.statusText}`);
    }

    return response;
}

/**
 * Return the GitLab endpoint to be used from the configuration.
 */
export function getEndpoint(config: GitLabSpaceConfiguration): string {
    const { customInstanceUrl } = config;
    return customInstanceUrl || 'https://gitlab.com';
}

/**
 * Return the access token from the configuration.
 * This will throw an error if the access token is not defined.
 */
export function getAccessToken(config: GitLabSpaceConfiguration): string {
    const { accessToken } = config;
    if (!accessToken) {
        throw httpError(401, 'Unauthorized: Missing access token');
    }

    return accessToken;
}
