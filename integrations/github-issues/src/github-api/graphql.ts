import type { Octokit } from 'octokit';

/**
 * Retrieve the IDs of all issues closed in the last 30 days from a GitHub repository.
 *
 * Fetch only IDs for fast retrieval.
 */
export async function getGitHubRepoClosedIssueIdsLast30Days(args: {
    octokit: Octokit;
    repository: {
        owner: string;
        name: string;
    };
    page?: {
        after: string | null;
        limit: number;
    };
}) {
    const { octokit, repository, page = { after: null, limit: 50 } } = args;

    const closedSinceDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

    const searchQuery = `repo:${repository.owner}/${repository.name} type:issue state:closed closed:>${closedSinceDate}`;
    const graphQLQuery = `
        query GetClosedIssuesLast30($searchQuery: String!, $first: Int!, $after: String) {
            search(query: $searchQuery, type: ISSUE, first: $first, after: $after) {
                issueCount
                pageInfo {
                    hasNextPage
                    endCursor
                }
                nodes {
                    ...on Issue {
                        id
                    }
                }
            }
        }
    `;

    try {
        return await octokit.graphql<GetClosedIssuesLast30DaysResponse>(graphQLQuery, {
            searchQuery,
            after: page.after,
            first: page.limit,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`GitHub GraphQL API error: ${errorMessage}`);
    }
}

/**
 * Retrieve a list of issues from a GitHub repository matching the list of provided IDs.
 */
export async function getGitHubRepoIssuesByIds(args: {
    octokit: Octokit;
    issueIds: GitHubIssue['id'][];
}) {
    const { octokit, issueIds } = args;

    const graphQLQuery = `
        ${ISSUE_WITH_COMMENTS_FRAGMENT}
        query GetIssuesByIds {
            nodes(ids: ${JSON.stringify(issueIds)}) {
                ...IssueWithComments
            }
        }
    `;

    try {
        return await octokit.graphql<GetIssuesByIdsResponse>(graphQLQuery);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`GitHub GraphQL API error: ${errorMessage}`);
    }
}

//
// Fragments
//
// Note: Make sure to update corresponding schema types below when updating the fragments.
//
const ISSUE_WITH_COMMENTS_FRAGMENT = `
    fragment IssueWithComments on Issue {
        id
        number
        title
        body
        url
        createdAt
        closedAt
        author {
            login
        }
        authorAssociation
        comments(last: 50) {
            nodes {
                body
                author {
                    login
                }
                authorAssociation
            }
        }
        repository {
            name
            owner {
                login
            }
        }
    }
`;

//
// Schema types
//
// Note: Make sure to update corresponding fragments when updating the schema types.
//
type GetClosedIssuesLast30DaysResponse = GitHubIssuesSearchResponse<{ id: GitHubIssue['id'] }>;
type GetIssuesByIdsResponse = GitHubIssuesSearchResponse<GitHubIssue>;

export interface GitHubIssuesSearchResponse<IssueNodesType> {
    search: {
        issueCount: number;
        pageInfo: {
            hasNextPage: boolean;
            endCursor?: string | null;
        };
        nodes: IssueNodesType[];
    } | null;
}

export interface GitHubIssue {
    id: string;
    number: number;
    title: string;
    body: string;
    url: string;
    createdAt: string;
    closedAt: string;

    author: {
        login: string;
    } | null;
    authorAssociation: AuthorAssociation;

    comments: {
        nodes: GitHubIssueComment[];
    };

    repository: {
        name: string;
        owner: {
            login: string;
        };
    };
}

export interface GitHubIssueComment {
    body: string;
    author: {
        login: string;
    } | null;

    authorAssociation: AuthorAssociation;
}

export type AuthorAssociation =
    | 'COLLABORATOR'
    | 'CONTRIBUTOR'
    | 'FIRST_TIMER'
    | 'FIRST_TIME_CONTRIBUTOR'
    | 'MANNEQUIN'
    | 'MEMBER'
    | 'NONE'
    | 'OWNER';
