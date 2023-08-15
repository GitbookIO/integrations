import LinkHeader from 'http-link-header';

import type { ConfigureState, GithubRuntimeContext } from './types';

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

/**
 * Fetch all installations for the current GitHub authentication. It will use
 * the access token from the environment.
 */
export async function fetchInstallations(context: GithubRuntimeContext) {
    const installations = await fetchGitHubAPI<Array<GHInstallation>>(context, {
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
    installationId: string
) {
    const repositories = await fetchGitHubAPI<Array<GHRepository>>(context, {
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
 * Fetch all branches for a given account repository.
 */
export async function fetchRepositoryBranches(
    context: GithubRuntimeContext,
    accountName: string,
    repositoryName: string
) {
    const branches = await fetchGitHubAPI<Array<GHBranch>>(context, {
        path: `/repos/${accountName}/${repositoryName}/branches`,
        params: {
            per_page: 100,
            page: 1,
        },
    });

    return branches;
}

export async function saveGitHubConfig(
    context: GithubRuntimeContext,
    existing: object,
    config: ConfigureState
) {
    const { api, environment } = context;
    if (!environment.installation) {
        throw new Error('Missing installation');
    }

    if (!environment.spaceInstallation) {
        throw new Error('Missing space installation');
    }

    if (!config.installation || !config.repository || !config.branch) {
        throw new Error('Incomplete configuration');
    }

    await api.integrations.updateIntegrationSpaceInstallation(
        environment.integration.name,
        environment.installation.id,
        environment.spaceInstallation.space,
        {
            configuration: {
                ...existing,
                key: config.key || crypto.randomUUID(),
                installation: config.installation,
                repository: config.repository,
                branch: config.branch,
                commitMessageTemplate: config.commitMessageTemplate,
                previewExternalBranches: config.previewExternalBranches,
                priority: config.priority,
            },
        }
    );
}

/**
 * Execute a GitHub API request.
 */
async function fetchGitHubAPI<T>(
    context: GithubRuntimeContext,
    request: {
        path: string;
        params?: object;
        /** Property to get an array for pagination */
        listProperty?: string;
    }
): Promise<T> {
    const { environment } = context;
    const { path, params, listProperty = '' } = request;

    const accessToken =
        environment.spaceInstallation?.configuration.oauth_credentials?.access_token;
    if (!accessToken) {
        throw new Error('Missing authentication');
    }

    const url = new URL(`https://api.github.com${path}`);
    Object.entries(params || {}).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });

    const response = await fetchGitHub(url, accessToken);

    let data = await response.json();

    let paginatedListProperty = false;
    if (listProperty) {
        // @ts-expect-error
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
                const nextResponse = await fetchGitHub(url, accessToken);
                const nextData = await nextResponse.json();
                // @ts-expect-error
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
 * Initiate the GitHub API request using the given access token.
 * It will throw an error if the response is not ok.
 */
async function fetchGitHub(url: URL, accessToken: string): Promise<Response> {
    const response = await fetch(url.toString(), {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'GitHub-Integration-Worker',
        },
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response;
}
