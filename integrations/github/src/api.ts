import LinkHeader from 'http-link-header';

import { Logger, ExposableError } from '@gitbook/runtime';

import type { GithubRuntimeContext, GitHubSpaceConfiguration } from './types';
import { assertIsDefined, getSpaceConfigOrThrow, signResponse } from './utils';

export type OAuthTokenCredentials = NonNullable<GitHubSpaceConfiguration['oauth_credentials']>;

const logger = Logger('github:api');

/**
 * NOTE: These GH types are not complete, they are just what we need for now.
 */

interface GHInstallation {
    id: number;
    account: {
        id: number;
        login: string;
        avatar_url: string;
        type: 'User' | 'Organization';
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

interface GHFetchOptions {
    walkPagination?: boolean;
    per_page?: number;
    page?: number;
    tokenCredentials?: OAuthTokenCredentials;
}

/**
 * Fetch all installations for the current GitHub authentication. It will use
 * the access token from the environment.
 */
export async function fetchInstallations(context: GithubRuntimeContext) {
    const installations = await githubAPI<Array<GHInstallation>>(context, null, {
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
    context: GithubRuntimeContext,
    installationId: number,
    options: GHFetchOptions = {},
) {
    const repositories = await githubAPI<Array<GHRepository>>(context, null, {
        path: `/user/installations/${installationId}/repositories`,
        params: {
            per_page: options.per_page || 100,
            page: options.page || 1,
        },
        listProperty: 'repositories',
        walkPagination: options.walkPagination,
    });

    return repositories;
}

/**
 * Search repositories for a given query.
 */
export async function searchRepositories(
    context: GithubRuntimeContext,
    query: string,
    options: GHFetchOptions = {},
) {
    const repository = await githubAPI<Array<GHRepository>>(
        context,
        options.tokenCredentials || null,
        {
            path: `/search/repositories`,
            params: {
                q: query,
                per_page: options.per_page || 100,
                page: options.page || 1,
            },
            walkPagination: options.walkPagination,
            listProperty: 'items',
        },
    );

    return repository;
}

/**
 * Fetch a repository by its ID.
 */
export async function fetchRepository(context: GithubRuntimeContext, repositoryId: number) {
    const repository = await githubAPI<GHRepository>(context, null, {
        path: `/repositories/${repositoryId}`,
    });

    return repository;
}

/**
 * Fetch all branches for a given account repository.
 */
export async function fetchRepositoryBranches(context: GithubRuntimeContext, repositoryId: number) {
    const branches = await githubAPI<Array<GHBranch>>(context, null, {
        path: `/repositories/${repositoryId}/branches`,
        params: {
            per_page: 100,
            page: 1,
        },
    });

    return branches;
}

/**
 * Fetch the GitHub App installation for the given installation ID
 * using the GitHub App JWT.
 */
export async function getAppInstallation(
    context: GithubRuntimeContext,
    appJWT: string,
    installationId: number,
): Promise<GHInstallation> {
    const installation = await githubAPI<GHInstallation>(
        context,
        { access_token: appJWT, expires_at: 0 },
        {
            method: 'GET',
            path: `/app/installations/${installationId}`,
        },
    );

    return installation;
}

/**
 * Get an access token for the GitHub App installation
 * using the GitHub App JWT.
 */
export async function createAppInstallationAccessToken(
    context: GithubRuntimeContext,
    appJWT: string,
    installationId: number,
): Promise<string> {
    const { token } = await githubAPI<{ token: string; expires_at: string }>(
        context,
        { access_token: appJWT, expires_at: 0 },
        {
            method: 'POST',
            path: `/app/installations/${installationId}/access_tokens`,
        },
    );

    return token;
}

/**
 * Create a commit status for a commit SHA using the GitHub
 * installation access token.
 */
export async function createCommitStatus(
    context: GithubRuntimeContext,
    installationAccessToken: string,
    owner: string,
    repo: string,
    sha: string,
    status: object,
): Promise<void> {
    await githubAPI(
        context,
        { access_token: installationAccessToken, expires_at: 0 },
        {
            method: 'POST',
            path: `/repos/${owner}/${repo}/statuses/${sha}`,
            body: status,
        },
    );
}

/**
 * Execute a GitHub API request.
 */
async function githubAPI<T>(
    context: GithubRuntimeContext,
    // Will be extracted from context if null
    tokenCredentials: OAuthTokenCredentials | null,
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
    },
): Promise<T> {
    const {
        method = 'GET',
        path,
        body,
        params,
        listProperty = '',
        walkPagination = true,
    } = request;

    const credentials = tokenCredentials || extractTokenCredentialsOrThrow(context);

    const url = new URL(`https://api.github.com${path}`);
    Object.entries(params || {}).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });
    const options = {
        method,
        body: body ? JSON.stringify(body) : undefined,
    };

    const response = await requestGitHubAPI(context, credentials, url, options);

    const isJSONResponse = response.headers.get('Content-Type')?.includes('application/json');
    if (!isJSONResponse) {
        return (await response.text()) as unknown as T;
    }

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
                const nextResponse = await requestGitHubAPI(context, credentials, url, options);
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
 * Make a fetch request to the GitHub API using the given token credentials.
 * It will throw an error if the response is not ok.
 */
async function requestGitHubAPI(
    context: GithubRuntimeContext,
    credentials: OAuthTokenCredentials,
    url: URL,
    options: RequestInit = {},
    retriesLeft = 1,
): Promise<Response> {
    const { access_token } = credentials;
    logger.debug(`GitHub API -> [${options.method}] ${url.toString()}, using proxy: ${context.environment.proxied}`);
    const response = await context.fetchWithProxy(url.toString(), {
        ...options,
        headers: {
            ...options.headers,
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${access_token}`,
            'User-Agent': 'GitHub-Integration-Worker',
            'X-GitHub-Api-Version': '2022-11-28',
        },
    });

    if (!response.ok) {
        // If the access token is expired, we try to refresh it
        if (response.status === 401 && retriesLeft > 0 && credentials?.refresh_token) {
            const spaceInstallation = context.environment.spaceInstallation;
            assertIsDefined(spaceInstallation, { label: 'spaceInstallation' });

            logger.debug(`refreshing OAuth credentials for space ${spaceInstallation.space}`);

            const refreshed = await refreshCredentials(context, credentials.refresh_token);

            await context.api.integrations.updateIntegrationSpaceInstallation(
                spaceInstallation.integration,
                spaceInstallation.installation,
                spaceInstallation.space,
                {
                    configuration: {
                        ...spaceInstallation.configuration,
                        oauth_credentials: refreshed,
                    },
                },
            );

            logger.info(`refreshed OAuth credentials for space ${spaceInstallation.space}`);

            // Retry the request with the refreshed credentials
            return requestGitHubAPI(context, refreshed, url, options, retriesLeft - 1);
        }

        const text = await response.text();

        logger.error(`[${options.method}] (${response.status}) GitHub API error: ${text}`);

        // Otherwise, we throw an error
        throw new ExposableError(`GitHub API error: ${response.statusText}`, response.status);
    }

    return response;
}

async function refreshCredentials(
    context: GithubRuntimeContext,
    refreshToken: string,
): Promise<OAuthTokenCredentials> {
    const url = new URL('https://github.com/login/oauth/access_token');

    url.searchParams.set('client_id', context.environment.secrets.CLIENT_ID);
    url.searchParams.set('client_secret', context.environment.secrets.CLIENT_SECRET);
    url.searchParams.set('grant_type', 'refresh_token');
    url.searchParams.set('refresh_token', refreshToken);

    const resp = await context.fetchWithProxy(url.toString(), {
        method: 'POST',
        headers: {
            'User-Agent': 'GitHub-Integration-Worker',
        },
    });

    if (!resp.ok) {
        // If refresh fails for whatever reason, we ask the user to re-authenticate
        throw new ExposableError(`Unauthorized: kindly re-authenticate!`, 401);
    }

    const data = await resp.formData();

    return {
        access_token: data.get('access_token') as string,
        refresh_token: data.get('refresh_token') as string,
        expires_at: Math.floor(Date.now() / 1000) + parseInt(data.get('expires_in') as string, 10),
    };
}

/**
 * Extract the token credentials of the space installation configuration from the context
 * This will throw an error if the access token is not defined.
 */
export function extractTokenCredentialsOrThrow(
    context: GithubRuntimeContext,
): OAuthTokenCredentials {
    const spaceInstallation = context.environment.spaceInstallation;
    assertIsDefined(spaceInstallation, {
        label: 'spaceInstallation',
    });

    const config = getSpaceConfigOrThrow(spaceInstallation);

    const oAuthCredentials = config?.oauth_credentials;
    if (!oAuthCredentials?.access_token) {
        throw new ExposableError('Unauthorized: kindly re-authenticate!', 401);
    }

    return oAuthCredentials;
}