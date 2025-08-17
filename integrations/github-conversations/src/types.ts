import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export type GitHubInstallationConfiguration = {
    /**
     * GitHub App installation ID.
     */
    installation_id?: string;

    /**
     * OAuth credentials (legacy, deprecated).
     */
    oauth_credentials?: {
        access_token: string;
        refresh_token?: string;
    };
};

export type GitHubRuntimeEnvironment = RuntimeEnvironment<GitHubInstallationConfiguration>;
export type GitHubRuntimeContext = RuntimeContext<GitHubRuntimeEnvironment>;

/**
 * GitHub API response types
 */
export interface GitHubRepository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    owner: {
        login: string;
        id: number;
        type: 'Organization' | 'User';
    };
    private: boolean;
    html_url: string;
    description?: string;
    has_discussions: boolean;
}

export interface GitHubOrganization {
    login: string;
    id: number;
    node_id: string;
    url: string;
    repos_url: string;
    events_url: string;
    hooks_url: string;
    issues_url: string;
    members_url: string;
    public_members_url: string;
    avatar_url: string;
    description?: string;
    name?: string;
    company?: string;
    blog?: string;
    location?: string;
    email?: string;
    twitter_username?: string;
    is_verified: boolean;
    has_organization_projects: boolean;
    has_repository_projects: boolean;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    html_url: string;
    created_at: string;
    updated_at: string;
    type: 'Organization';
}

export interface GitHubUser {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id?: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: 'User';
    site_admin: boolean;
    name?: string;
    company?: string;
    blog?: string;
    location?: string;
    email?: string;
    hireable?: boolean;
    bio?: string;
    twitter_username?: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
}

/**
 * GitHub Discussion GraphQL types
 */
export interface GitHubDiscussion {
    id: string;
    number: number;
    title: string;
    body: string;
    bodyHTML: string;
    bodyText: string;
    url: string;
    createdAt: string;
    updatedAt: string;
    author?: {
        login: string;
        avatarUrl?: string;
    } | null;
    category: {
        id: string;
        name: string;
        description?: string;
        emoji: string;
        isAnswerable: boolean;
    };
    answer?: {
        id: string;
        body: string;
        bodyHTML: string;
        bodyText: string;
        createdAt: string;
        author?: {
            login: string;
            avatarUrl?: string;
        } | null;
    } | null;
    isAnswered: boolean;
    comments: {
        totalCount: number;
        nodes: GitHubDiscussionComment[];
    };
    repository: {
        name: string;
        owner: {
            login: string;
        };
    };
}

export interface GitHubDiscussionComment {
    id: string;
    body: string;
    bodyHTML: string;
    bodyText: string;
    createdAt: string;
    updatedAt: string;
    author?: {
        login: string;
        avatarUrl?: string;
    } | null;
    isAnswer: boolean;
    replies: {
        totalCount: number;
        nodes: GitHubDiscussionComment[];
    };
}

/**
 * GitHub Webhook Discussion object (different from GraphQL structure)
 */
export interface GitHubWebhookDiscussion {
    id: number;
    node_id: string;
    number: number;
    title: string;
    user: GitHubUser;
    state: 'open' | 'closed';
    state_reason?: string;
    locked: boolean;
    comments: number;
    created_at: string;
    updated_at: string;
    author_association: string;
    active_lock_reason?: string;
    body: string;
    reactions: {
        url: string;
        total_count: number;
        [key: string]: any;
    };
    html_url: string;
    timeline_url: string;
    repository_url: string;
    category: {
        id: number;
        node_id: string;
        repository_id: number;
        emoji: string;
        name: string;
        description: string;
        created_at: string;
        updated_at: string;
        slug: string;
        is_answerable: boolean;
    };
    answer_html_url?: string;
    answer_chosen_at?: string;
    answer_chosen_by?: GitHubUser;
}

/**
 * GitHub Webhook payload types
 */
export interface GitHubWebhookPayload {
    action: string;
    discussion?: GitHubWebhookDiscussion;
    comment?: GitHubDiscussionComment;
    repository: GitHubRepository;
    sender: GitHubUser;
    installation?: {
        id: number;
    };
}

/**
 * GitHub GraphQL API types
 */
export interface GitHubGraphQLResponse<T> {
    data: T;
    errors?: Array<{
        message: string;
        locations?: Array<{
            line: number;
            column: number;
        }>;
        path?: string[];
    }>;
}

export interface GitHubDiscussionsResponse {
    repository: {
        discussions: {
            totalCount: number;
            pageInfo: {
                hasNextPage: boolean;
                endCursor?: string;
            };
            nodes: GitHubDiscussion[];
        };
    };
}

/**
 * GitHub App Installation types
 */
export interface GitHubAppInstallation {
    id: number;
    account: GitHubOrganization | GitHubUser;
    repository_selection: 'all' | 'selected';
    access_tokens_url: string;
    repositories_url: string;
    html_url: string;
    app_id: number;
    app_slug: string;
    target_id: number;
    target_type: 'Organization' | 'User';
    permissions: Record<string, string>;
    events: string[];
    created_at: string;
    updated_at: string;
    single_file_name?: string;
    has_multiple_single_files?: boolean;
    single_file_paths?: string[];
    suspended_by?: GitHubUser;
    suspended_at?: string;
}

export interface GitHubWebhook {
    type: string;
    id: number;
    name: 'web';
    active: boolean;
    events: string[];
    config: {
        url: string;
        content_type: 'json';
        insecure_ssl: '0' | '1';
        secret?: string;
    };
    updated_at: string;
    created_at: string;
    url: string;
    test_url: string;
    ping_url: string;
    deliveries_url: string;
    last_response?: {
        code: number;
        status: string;
        message?: string;
    };
}
