import httpError from 'http-errors';
import LinkHeader from 'http-link-header';

import type { GitHubSpaceConfiguration } from './types';

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
    full_name: string;
    owner: {
        id: number;
        login: string;
    };
    visibility: 'public' | 'private';
}

interface GHBranch {
    name: string;
    protected: boolean;
}

/**
 * Fetch all installations for the current GitHub authentication. It will use
 * the access token from the environment.
 */
export async function fetchInstallations(config: GitHubSpaceConfiguration) {
    const installations = await fetchGitHubAPI<Array<GHInstallation>>(config, {
        path: '/user/installations',
        params: {
            per_page: 100,
            page: 1,
        },
        listProperty: 'installations',
    });

    return installations;
}

/**
 * Fetch all repositories for a given installation.
 */
export async function fetchInstallationRepositories(
    config: GitHubSpaceConfiguration,
    installationId: number
) {
    const repositories = await fetchGitHubAPI<Array<GHRepository>>(config, {
        path: `/user/installations/${installationId}/repositories`,
        params: {
            per_page: 100,
            page: 1,
        },
        listProperty: 'repositories',
    });

    return repositories;
}

/**
 * Fetch a repository by its ID.
 */
export async function fetchRepository(config: GitHubSpaceConfiguration, repositoryId: number) {
    const repository = await fetchGitHubAPI<GHRepository>(config, {
        path: `/repositories/${repositoryId}`,
    });

    return repository;
}

/**
 * Fetch all branches for a given account repository.
 */
export async function fetchRepositoryBranches(
    config: GitHubSpaceConfiguration,
    repositoryId: number
) {
    const branches = await fetchGitHubAPI<Array<GHBranch>>(config, {
        path: `/repositories/${repositoryId}/branches`,
        params: {
            per_page: 100,
            page: 1,
        },
    });

    return branches;
}

/**
 * Get an access token for the GitHub App installation
 * using the GitHub App JWT.
 */
export async function createAppInstallationAccessToken(
    appJWT: string,
    installationId: number
): Promise<string> {
    const { token } = await fetchGitHubAPI<{ token: string }>(appJWT, {
        method: 'POST',
        path: `/app/installations/${installationId}/access_tokens`,
    });

    return token;
}

/**
 * Create a commit status for a commit SHA using the GitHub
 * installation access token.
 */
export async function createCommitStatus(
    installationAccessToken: string,
    owner: string,
    repo: string,
    sha: string,
    status: object
): Promise<void> {
    await fetchGitHubAPI(installationAccessToken, {
        method: 'POST',
        path: `/repos/${owner}/${repo}/statuses/${sha}`,
        body: status,
    });
}

/**
 * Execute a GitHub API request.
 */
async function fetchGitHubAPI<T>(
    /**
     * The credential source can be either a string (a token) or a GitHubSpaceConfiguration
     * (from which we will extract the token)
     */
    credentialSource: GitHubSpaceConfiguration | string,
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

    const tokenCredentials =
        typeof credentialSource === 'string'
            ? { token: credentialSource }
            : getTokenCredentialsOrThrow(credentialSource);

    const url = new URL(`https://api.github.com${path}`);
    Object.entries(params || {}).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });
    const options = {
        method,
        body: body ? JSON.stringify(body) : undefined,
    };

    const response = await requestGitHub(url, tokenCredentials, options);

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
                const nextResponse = await requestGitHub(url, tokenCredentials, options);
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
 * Execute the GitHub API request using the given token credentials.
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
        throw httpError(response.status, `GitHub API error: ${response.statusText}`);
    }

    return response;
}

interface TokenCredentials {
    /**
     * The access token to use for the request.
     */
    token: string;
    /**
     * Optional refresh token to use for the request.
     */
    refreshToken?: string;
}

/**
 * Return the token credentials from the configuration.
 * This will throw an error if the access token is not defined.
 */
export function getTokenCredentialsOrThrow(config: GitHubSpaceConfiguration): TokenCredentials {
    const oAuthCredentials = config?.oauth_credentials;
    if (!oAuthCredentials?.access_token) {
        throw httpError(401, 'Unauthorized: Missing access token');
    }

    return {
        token: oAuthCredentials.access_token,
        refreshToken: oAuthCredentials.refresh_token,
    };
}
