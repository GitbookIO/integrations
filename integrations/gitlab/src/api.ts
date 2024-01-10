import LinkHeader from 'http-link-header';
import { StatusError } from 'itty-router';

import { Logger } from '@gitbook/runtime';

import type { GitLabSpaceConfiguration } from './types';

const logger = Logger('gitlab:api');

/**
 * NOTE: These GL types are not complete, they are just what we need for now.
 */

interface GLProject {
    id: number;
    name: string;
    name_with_namespace: string;
    path_with_namespace: string;
    visibility: 'public' | 'private' | 'internal';
}

interface GLBranch {
    name: string;
    protected: boolean;
}

interface GLUser {
    id: number;
    name: string;
    username: string;
}

interface GLFetchOptions {
    walkPagination?: boolean;
    per_page?: number;
    page?: number;
}

/**
 * Fetch the current GitLab user. It will use the access token from the environment.
 */
export async function getCurrentUser(config: GitLabSpaceConfiguration) {
    const user = await gitlabAPI<GLUser>(config, {
        path: '/user',
    });

    return user;
}

/**
 * Fetch all projects for the current GitLab authentication. It will use
 * the access token from the environment.
 */
export async function fetchProjects(
    config: GitLabSpaceConfiguration,
    options: GLFetchOptions = {}
) {
    const projects = await gitlabAPI<Array<GLProject>>(config, {
        path: '/projects',
        params: {
            membership: true,
            per_page: options.per_page || 100,
            page: options.page || 1,
        },
        walkPagination: options.walkPagination,
    });

    return projects;
}

/**
 * Search currently authenticated user projects for a given query.
 */
export async function searchUserProjects(
    config: GitLabSpaceConfiguration,
    search: string,
    options: GLFetchOptions = {}
) {
    const projects = await gitlabAPI<Array<GLProject>>(config, {
        path: `/users/${config.userId}/projects`,
        params: {
            search,
            per_page: options.per_page || 100,
            page: options.page || 1,
        },
        walkPagination: options.walkPagination,
    });

    return projects;
}

/**
 * Fetch a GitLab project by its ID.
 */
export async function fetchProject(config: GitLabSpaceConfiguration, projectId: number) {
    const project = await gitlabAPI<GLProject>(config, {
        path: `/projects/${projectId}`,
    });

    return project;
}

/**
 * Fetch all branches for a given project repository.
 */
export async function fetchProjectBranches(config: GitLabSpaceConfiguration, projectId: number) {
    const branches = await gitlabAPI<Array<GLBranch>>(config, {
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
    webhookUrl: string,
    webhookToken: string
) {
    const { id } = await gitlabAPI<{ id: number }>(config, {
        method: 'POST',
        path: `/projects/${projectId}/hooks`,
        body: {
            url: webhookUrl,
            token: webhookToken,
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
    await gitlabAPI(config, {
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
    await gitlabAPI(config, {
        method: 'POST',
        path: `/projects/${projectId}/statuses/${sha}`,
        body: status,
    });
}

/**
 * Execute a GitLab API request.
 */
export async function gitlabAPI<T>(
    config: GitLabSpaceConfiguration,
    request: {
        method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
        path: string;
        body?: object;
        params?: object;
        /** Property to get an array for pagination */
        listProperty?: string;
        /**
         * Should the entire list of objects be fetched by walking over pages
         * @default true
         */
        walkPagination?: boolean;
    }
): Promise<T> {
    const {
        method = 'GET',
        path,
        body,
        params,
        listProperty = '',
        walkPagination = true,
    } = request;

    const token = getAccessTokenOrThrow(config);
    const endpoint = getEndpoint(config);

    const baseEndpoint = `${endpoint || 'https://gitlab.com'}/api/v4`;

    const url = new URL(`${baseEndpoint}${path}`);
    Object.entries(params || {}).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });
    const options = {
        method,
        body: body ? JSON.stringify(body) : undefined,
    };

    const response = await requestGitLab(token, url, options);

    let data = await response.json();

    let paginatedListProperty = false;
    if (listProperty) {
        // @ts-ignore
        data = data[listProperty];
        paginatedListProperty = true;
    }

    // Pagination
    let res = response;
    while (res.headers.has('Link') && walkPagination) {
        const link = LinkHeader.parse(res.headers.get('Link') || '');
        if (link.has('rel', 'next')) {
            const nextURL = new URL(link.get('rel', 'next')[0].uri);
            const nextURLSearchParams = Object.fromEntries(nextURL.searchParams);
            if (nextURLSearchParams.page) {
                url.searchParams.set('page', nextURLSearchParams.page as string);
                const nextResponse = await requestGitLab(token, url, options);
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
 * Execute the GitLab API request using the given token
 * It will throw an error if the response is not ok.
 */
async function requestGitLab(
    token: string,
    url: URL,
    options: RequestInit = {}
): Promise<Response> {
    logger.debug(`GitLab API -> [${options.method}] ${url.toString()}`);
    const response = await fetch(url.toString(), {
        ...options,
        headers: {
            ...options.headers,
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'User-Agent': 'GitLab-Integration-Worker',
        },
    });

    if (!response.ok) {
        const text = await response.text();

        logger.error(`[${options.method}] (${response.status}) GitLab API error: ${text}`);

        throw new StatusError(response.status, `GitLab API error: ${response.statusText}`);
    }

    return response;
}

/**
 * Return the GitLab endpoint to be used from the configuration.
 */
function getEndpoint(config: GitLabSpaceConfiguration): string {
    const { customInstanceUrl } = config;
    return customInstanceUrl || 'https://gitlab.com';
}

/**
 * Return the access token from the configuration.
 * This will throw a 401 if the access token is not defined.
 */
export function getAccessTokenOrThrow(config: GitLabSpaceConfiguration): string {
    const { accessToken } = config;
    if (!accessToken) {
        throw new StatusError(401, 'Unauthorized: kindly re-authenticate with a new access token.');
    }

    return accessToken;
}
