import httpError from 'http-errors';
import LinkHeader from 'http-link-header';

import type { GitLabRuntimeContext, GitLabSpaceConfiguration } from './types';
import { getSpaceConfig } from './utils';

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
export async function fetchProjects(context: GitLabRuntimeContext) {
    const projects = await fetchGitLabAPI<Array<GLProject>>(
        {
            path: '/projects',
            params: {
                membership: true,
                per_page: 100,
                page: 1,
            },
        },
        getAccessToken(getSpaceConfig(context))
    );

    return projects;
}

/**
 * Fetch all branches for a given project repository.
 */
export async function fetchProjectBranches(context: GitLabRuntimeContext, projectId: number) {
    const branches = await fetchGitLabAPI<Array<GLBranch>>(
        {
            path: `/projects/${projectId}/repository/branches`,
            params: {
                per_page: 100,
                page: 1,
            },
        },
        getAccessToken(getSpaceConfig(context))
    );

    return branches;
}

// /**
//  * Create a commit status for a commit SHA.
//  */
// export async function createCommitStatus(
//     appJWT: string,
//     owner: string,
//     repo: string,
//     sha: string,
//     status: object
// ): Promise<void> {
//     await fetchGitHubAPI<{ token: string }>(
//         {
//             method: 'POST',
//             path: `/repos/${owner}/${repo}/statuses/${sha}`,
//             body: status,
//         },
//         { token: appJWT }
//     );
// }

/**
 * Execute a GitLab API request.
 */
async function fetchGitLabAPI<T>(
    request: {
        endpoint?: string;
        method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
        path: string;
        body?: object;
        params?: object;
        /** Property to get an array for pagination */
        listProperty?: string;
    },
    token: string
): Promise<T> {
    const { method = 'GET', endpoint, path, body, params, listProperty = '' } = request;

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
            'User-Agent': 'GitHub-Integration-Worker',
        },
    });

    if (!response.ok) {
        throw httpError(response.status, `GitLab API error: ${response.statusText}`);
    }

    return response;
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
