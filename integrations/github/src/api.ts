import LinkHeader from 'http-link-header';

import type { GithubRuntimeContext } from './types';

/**
 * NOTE: These GH types are not complete, they are just what we need for now.
 */

interface GHInstallation {
    id: number;
    account: {
        id: number;
        login: string;
        avatar_url: string;
    };
}

interface GHRepository {
    id: number;
    name: string;
    visibility: 'public' | 'private';
}

interface GHBranch {
    name: string;
    protected: boolean;
}

interface TokenCredentials {
    token: string;
    refreshToken?: string;
}

/**
 * Fetch all installations for the current GitHub authentication. It will use
 * the access token from the environment.
 */
export async function fetchInstallations(context: GithubRuntimeContext) {
    const installations = await fetchGitHubAPI<Array<GHInstallation>>(
        {
            path: '/user/installations',
            params: {
                per_page: 100,
                page: 1,
            },
            listProperty: 'installations',
        },
        parseOAuthCredentials(context)
    );

    return installations;
}

/**
 * Fetch all repositories for a given installation.
 */
export async function fetchInstallationRepositories(
    context: GithubRuntimeContext,
    installationId: number
) {
    const repositories = await fetchGitHubAPI<Array<GHRepository>>(
        {
            path: `/user/installations/${installationId}/repositories`,
            params: {
                per_page: 100,
                page: 1,
            },
            listProperty: 'repositories',
        },
        parseOAuthCredentials(context)
    );

    return repositories;
}

/**
 * Fetch all branches for a given account repository.
 */
export async function fetchRepositoryBranches(
    context: GithubRuntimeContext,
    accountName: string,
    repositoryName: string
) {
    const branches = await fetchGitHubAPI<Array<GHBranch>>(
        {
            path: `/repos/${accountName}/${repositoryName}/branches`,
            params: {
                per_page: 100,
                page: 1,
            },
        },
        parseOAuthCredentials(context)
    );

    return branches;
}

/**
 * Get an access token for the GitHub App installation.
 */
export async function createAppInstallationAccessToken(
    appJWT: string,
    installationId: number
): Promise<string> {
    const { token } = await fetchGitHubAPI<{ token: string }>(
        {
            method: 'POST',
            path: `/app/installations/${installationId}/access_tokens`,
        },
        { token: appJWT }
    );

    return token;
}

/**
 * Create a commit status for a commit SHA.
 */
export async function createCommitStatus(
    appJWT: string,
    owner: string,
    repo: string,
    sha: string,
    status: object
): Promise<void> {
    await fetchGitHubAPI<{ token: string }>(
        {
            method: 'POST',
            path: `/repos/${owner}/${repo}/statuses/${sha}`,
            body: status,
        },
        { token: appJWT }
    );
}

/**
 * Execute a GitHub API request.
 */
async function fetchGitHubAPI<T>(
    request: {
        method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
        path: string;
        body?: object;
        params?: object;
        /** Property to get an array for pagination */
        listProperty?: string;
    },
    credentials: TokenCredentials
): Promise<T> {
    const { method = 'GET', path, body, params, listProperty = '' } = request;

    const url = new URL(`https://api.github.com${path}`);
    Object.entries(params || {}).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });
    const options = {
        method,
        body: body ? JSON.stringify(body) : undefined,
    };

    const response = await requestGitHub(url, credentials, options);

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
                const nextResponse = await requestGitHub(url, credentials, options);
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
 * Execute the GitHub API request using the given access token.
 * It will throw an error if the response is not ok.
 */
async function requestGitHub(
    url: URL,
    tokenCredentials: TokenCredentials,
    options: RequestInit = {}
): Promise<Response> {
    const { token } = tokenCredentials;
    const response = await fetch(url.toString(), {
        ...options,
        headers: {
            ...options.headers,
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${token}`,
            'User-Agent': 'GitHub-Integration-Worker',
            'X-GitHub-Api-Version': '2022-11-28',
        },
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response;
}

/**
 * Parse the OAuth credentials from the space configuration.
 */
function parseOAuthCredentials({ environment }: GithubRuntimeContext): TokenCredentials {
    const oAuthCredentials = environment.spaceInstallation?.configuration.oauth_credentials;
    if (!oAuthCredentials?.access_token) {
        throw new Error(`Missing access token`);
    }

    return {
        token: oAuthCredentials.access_token,
        refreshToken: oAuthCredentials.refresh_token,
    };
}
