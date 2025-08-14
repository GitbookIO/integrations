import { ExposableError, getOAuthToken, Logger, OAuthConfig } from '@gitbook/runtime';
import {
    GitHubRuntimeContext,
    GitHubRepository,
    GitHubOrganization,
    GitHubUser,
    GitHubWebhook,
    GitHubDiscussionsResponse,
    GitHubGraphQLResponse,
} from './types';

const logger = Logger('github-conversations:client');

/**
 * Get the OAuth configuration for the GitHub integration.
 */
export function getGitHubOAuthConfig(context: GitHubRuntimeContext): OAuthConfig {
    return {
        redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
        clientId: context.environment.secrets.CLIENT_ID,
        clientSecret: context.environment.secrets.CLIENT_SECRET,
        scopes: ['repo', 'read:discussion', 'read:org', 'write:repo_hook'],
        authorizeURL: () => 'https://github.com/login/oauth/authorize',
        accessTokenURL: () => 'https://github.com/login/oauth/access_token',
        extractCredentials: async (response) => {
            if (!response.access_token) {
                logger.error('OAuth response missing access_token', {
                    responseKeys: Object.keys(response),
                });
                throw new Error(
                    `Failed to exchange code for access token: ${JSON.stringify(response)}`,
                );
            }

            logger.debug('GitHub OAuth response received', {
                hasAccessToken: !!response.access_token,
                tokenLength: response.access_token?.length,
            });

            try {
                // Get user information using the access token
                const userResponse = await fetch('https://api.github.com/user', {
                    headers: {
                        Authorization: `Bearer ${response.access_token}`,
                        Accept: 'application/vnd.github.v3+json',
                        'User-Agent': 'GitBook-GitHub-Conversations',
                    },
                });

                if (!userResponse.ok) {
                    const errorText = await userResponse.text();
                    throw new Error(
                        `Failed to fetch user info: ${userResponse.status} ${userResponse.statusText} - ${errorText}`,
                    );
                }

                const userData = (await userResponse.json()) as GitHubUser;

                return {
                    externalIds: [userData.login],
                    configuration: {
                        oauth_credentials: {
                            access_token: response.access_token,
                            refresh_token: response.refresh_token,
                        },
                    },
                };
            } catch (error) {
                logger.error('Failed to fetch GitHub user info', {
                    error: error instanceof Error ? error.message : String(error),
                });
                throw new ExposableError(`Failed to get GitHub user info: ${error}`);
            }
        },
    };
}

/**
 * Initialize a GitHub API client for a given installation.
 */
export class GitHubClient {
    private accessToken: string;
    private baseUrl = 'https://api.github.com';
    private graphqlUrl = 'https://api.github.com/graphql';

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                Accept: 'application/vnd.github.v3+json',
                'User-Agent': 'GitBook-GitHub-Conversations',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `GitHub API error: ${response.status} ${response.statusText} - ${errorText}`,
            );
        }

        return response.json();
    }

    private async makeGraphQLRequest<T>(
        query: string,
        variables: Record<string, any> = {},
    ): Promise<GitHubGraphQLResponse<T>> {
        const response = await fetch(this.graphqlUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'User-Agent': 'GitBook-GitHub-Conversations',
            },
            body: JSON.stringify({ query, variables }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `GitHub GraphQL API error: ${response.status} ${response.statusText} - ${errorText}`,
            );
        }

        return response.json();
    }

    /**
     * Get user organizations
     */
    async getUserOrganizations(): Promise<GitHubOrganization[]> {
        return this.makeRequest<GitHubOrganization[]>('/user/orgs');
    }

    /**
     * Get repositories for a user or organization
     */
    async getRepositories(owner?: string): Promise<GitHubRepository[]> {
        const endpoint = owner ? `/orgs/${owner}/repos` : '/user/repos';
        const repos = await this.makeRequest<GitHubRepository[]>(
            `${endpoint}?per_page=100&sort=updated`,
        );

        // Filter repositories that have discussions enabled
        return repos.filter((repo) => repo.has_discussions);
    }

    /**
     * Get a specific repository
     */
    async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
        return this.makeRequest<GitHubRepository>(`/repos/${owner}/${repo}`);
    }

    /**
     * Get discussions for a repository using GraphQL
     */
    async getDiscussions(
        owner: string,
        repo: string,
        after?: string,
        first: number = 100,
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
                            comments(first: 100) {
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
                                    replies(first: 50) {
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
        const payload = {
            name: 'web' as const,
            active: true,
            events: ['discussion', 'discussion_comment'],
            config: {
                url: webhookUrl,
                content_type: 'json' as const,
                insecure_ssl: '0' as const,
                ...(secret && { secret }),
            },
        };

        return this.makeRequest<GitHubWebhook>(`/repos/${owner}/${repo}/hooks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
    }

    /**
     * List webhooks for a repository
     */
    async listWebhooks(owner: string, repo: string): Promise<GitHubWebhook[]> {
        return this.makeRequest<GitHubWebhook[]>(`/repos/${owner}/${repo}/hooks`);
    }

    /**
     * Delete a webhook
     */
    async deleteWebhook(owner: string, repo: string, hookId: number): Promise<void> {
        await this.makeRequest(`/repos/${owner}/${repo}/hooks/${hookId}`, {
            method: 'DELETE',
        });
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

    const { oauth_credentials } = installation.configuration;
    if (!oauth_credentials) {
        throw new ExposableError('GitHub OAuth credentials not found');
    }

    const token = await getOAuthToken(oauth_credentials, getGitHubOAuthConfig(context), context);
    return new GitHubClient(token);
}
