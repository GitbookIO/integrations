import { ExposableError, Logger } from '@gitbook/runtime';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { Octokit } from 'octokit';
import {
    GitHubRuntimeContext,
    GitHubRepository,
    GitHubOrganization,
    GitHubWebhook,
    GitHubDiscussionsResponse,
    GitHubGraphQLResponse,
} from './types';

const logger = Logger('github-conversations:client');

/**
 * Generate a JWT token for GitHub App authentication.
 */
async function generateJWT(appId: string, privateKey: string): Promise<string> {
    const now = Math.floor(Date.now() / 1000);

    const payload = {
        iat: now - 60, // Issued 60 seconds ago (for clock drift)
        exp: now + 600, // Expires in 10 minutes
        iss: appId,
    };

    // Sign with RS256 algorithm using the private key
    return await jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}

/**
 * Get an installation access token for GitHub App.
 */
export async function getInstallationAccessToken(
    installationId: string,
    appId: string,
    privateKey: string,
): Promise<string> {
    const jwtToken = await generateJWT(appId, privateKey);

    logger.debug('Requesting installation access token', { installationId });

    const octokit = new Octokit({
        auth: jwtToken,
        userAgent: 'GitBook-GitHub-Conversations',
    });

    try {
        const response = await octokit.request(
            'POST /app/installations/{installation_id}/access_tokens',
            {
                installation_id: parseInt(installationId),
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            },
        );

        logger.debug('Installation access token obtained successfully');
        return response.data.token;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to get installation access token: ${errorMessage}`);
    }
}

/**
 * Get GitHub App configuration for installation-based authentication.
 */
export function getGitHubAppConfig(context: GitHubRuntimeContext) {
    return {
        appId: context.environment.secrets.GITHUB_APP_ID,
        privateKey: context.environment.secrets.GITHUB_PRIVATE_KEY,
        installationId: context.environment.installation?.configuration?.installation_id,
    };
}

/**
 * Initialize a GitHub API client for a given installation.
 */
export class GitHubClient {
    private octokit: Octokit;

    constructor(accessToken: string) {
        this.octokit = new Octokit({
            auth: accessToken,
            userAgent: 'GitBook-GitHub-Conversations',
        });
    }

    private async makeGraphQLRequest<T>(
        query: string,
        variables: Record<string, any> = {},
    ): Promise<GitHubGraphQLResponse<T>> {
        try {
            const response = await this.octokit.graphql<T>(query, variables);
            return { data: response } as GitHubGraphQLResponse<T>;
        } catch (error) {
            // Octokit throws errors for GraphQL errors, wrap them in our expected format
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`GitHub GraphQL API error: ${errorMessage}`);
        }
    }

    /**
     * Get user organizations
     */
    async getUserOrganizations(): Promise<GitHubOrganization[]> {
        const response = await this.octokit.request('GET /user/orgs', {
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });
        return response.data as GitHubOrganization[];
    }

    /**
     * Get repositories for a user or organization
     */
    async getRepositories(owner?: string): Promise<GitHubRepository[]> {
        const response = owner
            ? await this.octokit.request('GET /orgs/{org}/repos', {
                  org: owner,
                  per_page: 100,
                  sort: 'updated',
                  headers: {
                      'X-GitHub-Api-Version': '2022-11-28',
                  },
              })
            : await this.octokit.request('GET /user/repos', {
                  per_page: 100,
                  sort: 'updated',
                  headers: {
                      'X-GitHub-Api-Version': '2022-11-28',
                  },
              });

        // Filter repositories that have discussions enabled
        return response.data.filter((repo: any) => repo.has_discussions) as GitHubRepository[];
    }

    /**
     * Get a specific repository
     */
    async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
        const response = await this.octokit.request('GET /repos/{owner}/{repo}', {
            owner,
            repo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });
        return response.data as GitHubRepository;
    }

    /**
     * Get discussions for a repository using GraphQL
     */
    async getDiscussions(
        owner: string,
        repo: string,
        after?: string,
        first: number = 10,
        states: string[] = ['CLOSED'], // Only get closed discussions by default
    ): Promise<GitHubDiscussionsResponse> {
        const query = `
            query getDiscussions($owner: String!, $name: String!, $first: Int!, $after: String, $states: [DiscussionState!]) {
                repository(owner: $owner, name: $name) {
                    discussions(first: $first, after: $after, states: $states, orderBy: {field: UPDATED_AT, direction: DESC}) {
                        totalCount
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                        nodes {
                            id
                            number
                            title
                            body
                            bodyHTML
                            bodyText
                            url
                            createdAt
                            updatedAt
                            author {
                                login
                                ... on User {
                                    avatarUrl
                                }
                            }
                            category {
                                id
                                name
                                description
                                emoji
                                isAnswerable
                            }
                            answer {
                                id
                                body
                                bodyHTML
                                bodyText
                                createdAt
                                author {
                                    login
                                    ... on User {
                                        avatarUrl
                                    }
                                }
                            }
                            isAnswered
                            comments(first: 20) {
                                totalCount
                                nodes {
                                    id
                                    body
                                    bodyHTML
                                    bodyText
                                    createdAt
                                    updatedAt
                                    author {
                                        login
                                        ... on User {
                                            avatarUrl
                                        }
                                    }
                                    isAnswer
                                    replies(first: 3) {
                                        totalCount
                                        nodes {
                                            id
                                            body
                                            bodyHTML
                                            bodyText
                                            createdAt
                                            updatedAt
                                            author {
                                                login
                                                ... on User {
                                                    avatarUrl
                                                }
                                            }
                                            isAnswer
                                        }
                                    }
                                }
                            }
                            repository {
                                name
                                owner {
                                    login
                                }
                            }
                        }
                    }
                }
            }
        `;

        const variables = {
            owner,
            name: repo,
            first,
            after,
            states,
        };

        const response = await this.makeGraphQLRequest<GitHubDiscussionsResponse>(query, variables);

        if (response.errors) {
            logger.error('GraphQL errors in getDiscussions', { errors: response.errors });
            throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
        }

        return response.data;
    }

    /**
     * Create a webhook for a repository
     */
    async createWebhook(
        owner: string,
        repo: string,
        webhookUrl: string,
        secret?: string,
    ): Promise<GitHubWebhook> {
        const response = await this.octokit.request('POST /repos/{owner}/{repo}/hooks', {
            owner,
            repo,
            name: 'web',
            active: true,
            events: ['discussion', 'discussion_comment'],
            config: {
                url: webhookUrl,
                content_type: 'json',
                insecure_ssl: '0',
                ...(secret && { secret }),
            },
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });
        return response.data as GitHubWebhook;
    }

    /**
     * List webhooks for a repository
     */
    async listWebhooks(owner: string, repo: string): Promise<GitHubWebhook[]> {
        const response = await this.octokit.request('GET /repos/{owner}/{repo}/hooks', {
            owner,
            repo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });
        return response.data as GitHubWebhook[];
    }

    /**
     * Delete a webhook
     */
    async deleteWebhook(owner: string, repo: string, hookId: number): Promise<void> {
        await this.octokit.request('DELETE /repos/{owner}/{repo}/hooks/{hook_id}', {
            owner,
            repo,
            hook_id: hookId,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });
    }

    /**
     * Get repositories accessible to the installation
     */
    async getInstallationRepositories(): Promise<GitHubRepository[]> {
        const response = await this.octokit.request('GET /installation/repositories', {
            per_page: 100,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });

        return response.data.repositories as GitHubRepository[];
    }
}

/**
 * Get a GitHub API client for a given installation context.
 */
export async function getGitHubClient(context: GitHubRuntimeContext): Promise<GitHubClient> {
    const { installation } = context.environment;

    if (!installation) {
        throw new ExposableError('Installation not found');
    }

    const { installation_id } = installation.configuration;
    if (!installation_id) {
        throw new ExposableError('GitHub App installation ID not found');
    }

    const config = getGitHubAppConfig(context);
    if (!config.appId || !config.privateKey) {
        throw new ExposableError('GitHub App credentials not configured');
    }

    const token = await getInstallationAccessToken(
        installation_id,
        config.appId,
        config.privateKey,
    );
    return new GitHubClient(token);
}

/**
 * Fetch all repositories that the GitHub App installation has access to.
 */
export async function fetchRepositoriesWithDiscussions(
    context: GitHubRuntimeContext,
): Promise<GitHubRepository[]> {
    const { installation } = context.environment;

    if (!installation) {
        throw new ExposableError('Installation not found');
    }

    const { installation_id } = installation.configuration;
    if (!installation_id) {
        throw new ExposableError('GitHub App installation ID not found');
    }

    logger.info('Fetching enabled repositories for GitHub App installation', {
        installationId: installation_id,
    });

    try {
        const client = await getGitHubClient(context);
        const repositories = await client.getInstallationRepositories();

        logger.info('Successfully fetched enabled repositories', {
            installationId: installation_id,
            repositoryCount: repositories.length,
            repositories: repositories.map((repo) => ({
                name: repo.name,
                fullName: repo.full_name,
                hasDiscussions: repo.has_discussions,
                private: repo.private,
            })),
        });

        return repositories.filter((repo) => repo.has_discussions);
    } catch (error) {
        logger.error('Failed to fetch enabled repositories', {
            installationId: installation_id,
            error: error instanceof Error ? error.message : String(error),
        });
        throw error;
    }
}
