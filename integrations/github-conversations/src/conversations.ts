import pMap from 'p-map';
import { Octokit } from 'octokit';
import { ConversationInput } from '@gitbook/api';

export type GitHubDiscussion = {
    id: string;
    title: string;
    url: string;
    body: string;
    createdAt: string;
    comments: {
        nodes: {
            body: string;
            createdAt: string;
        }[];
    };
};

const DISCUSSIONS_QUERY = `
query($owner: String!, $repo: String!, $cursor: String) {
  repository(owner: $owner, name: $repo) {
    discussions(first: 50, after: $cursor, states: CLOSED) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        title
        url
        body
        createdAt
        comments(first: 100) {
          nodes { body createdAt }
        }
      }
    }
  }
}`;

export const DISCUSSION_QUERY = `
query($owner: String!, $repo: String!, $number: Int!) {
  repository(owner: $owner, name: $repo) {
    discussion(number: $number) {
      id
      title
      url
      body
      createdAt
      comments(first: 100) {
        nodes { body createdAt }
      }
    }
  }
}`;

/**
 * Ingest closed discussions from a repository
 */
export async function ingestDiscussions(
    client: Octokit,
    repository: string,
    onConversations: (conv: ConversationInput[]) => Promise<void>,
) {
    const [owner, repo] = repository.split('/');
    let cursor: string | undefined;
    let hasNext = true;

    while (hasNext) {
        const result = await client.graphql<any>(DISCUSSIONS_QUERY, {
            owner,
            repo,
            cursor,
        });
        const discussions: GitHubDiscussion[] = result.repository.discussions.nodes;
        cursor = result.repository.discussions.pageInfo.endCursor;
        hasNext = result.repository.discussions.pageInfo.hasNextPage;

        const conversations = await pMap(
            discussions,
            async (discussion) => parseDiscussionAsConversation(discussion),
            { concurrency: 3 },
        );

        if (conversations.length > 0) {
            await onConversations(conversations);
        }
    }
}

/** Convert a GitHub discussion to a GitBook conversation */
export async function parseDiscussionAsConversation(
    discussion: GitHubDiscussion,
): Promise<ConversationInput> {
    const parts = [
        {
            type: 'message',
            role: 'user' as const,
            body: discussion.body,
        },
        ...discussion.comments.nodes.map((c) => ({
            type: 'message' as const,
            role: 'user' as const,
            body: c.body,
        })),
    ];

    const conversation: ConversationInput = {
        id: discussion.id,
        subject: discussion.title,
        metadata: {
            url: discussion.url,
            attributes: {},
            createdAt: discussion.createdAt,
        },
        parts,
    };

    return conversation;
}
