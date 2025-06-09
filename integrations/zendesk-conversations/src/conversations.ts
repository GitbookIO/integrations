import pMap from 'p-map';
import { ZendeskClient, ZendeskTicket } from './zendesk';
import { ConversationInput, ConversationPartMessage } from '@gitbook/api';

/**
 * Ingest the last closed tickets from Zendesk.
 */
export async function ingestTickets(
    client: ZendeskClient,
    onConversations: (conversation: ConversationInput[]) => Promise<void>,
    options: {
        /** From when to ingest tickets. */
        startTime: Date;
        /** Maximum number of tickets to ingest. */
        maxTickets: number;
    },
) {
    let cursor: string | null = null;
    let ticketsIngested = 0;

    do {
        const { tickets, after_cursor } = await client.listTicketsIncremental({
            startTime: options.startTime,
            cursor,
        });
        cursor = after_cursor;

        const closedTickets = tickets.filter(isTicketClosed);
        ticketsIngested += closedTickets.length;

        const conversations = await pMap(
            closedTickets,
            async (ticket) => {
                return await parseTicketAsConversation(client, ticket);
            },
            {
                concurrency: 3,
            },
        );

        if (conversations.length > 0) {
            await onConversations(conversations);
        }
    } while (ticketsIngested < options.maxTickets && !!cursor);
}

/**
 * Fetch the conversation from Zendesk and parse it into a GitBook conversation.
 */
export async function parseTicketAsConversation(
    client: ZendeskClient,
    ticket: ZendeskTicket,
): Promise<ConversationInput> {
    if (!isTicketClosed(ticket)) {
        throw new Error(`Ticket ${ticket.id} is not closed or solved`);
    }

    const comments = await client.listTicketComments(ticket.id);
    const conversation: ConversationInput = {
        id: `${client.subdomain}/${ticket.id}`,
        subject: ticket.subject,
        metadata: {
            url: `https://${client.subdomain}.zendesk.com/agent/tickets/${ticket.id}`,
            attributes: {
                id: ticket.id.toString(),
                subdomain: client.subdomain,
            },
            createdAt: ticket.created_at,
        },
        parts: await pMap(
            comments.comments,
            async (comment) => {
                return {
                    type: 'message',
                    role: await getUserRole(client, comment.author_id),
                    body: comment.plain_body,
                };
            },
            {
                concurrency: 3,
            },
        ),
    };

    return conversation;
}

const cachedRoles = new Map<string, ConversationPartMessage['role']>();

/**
 * Evaluate if a user is an end-user or a team member.
 * We cache the result to avoid making too many requests to Zendesk.
 */
async function getUserRole(
    client: ZendeskClient,
    userId: number,
): Promise<ConversationPartMessage['role']> {
    const cacheKey = `${client.subdomain}/${userId}`;
    const cachedRole = cachedRoles.get(cacheKey);
    if (cachedRole) return cachedRole;

    const { user } = await client.getUser(userId);
    const role = user.role === 'end-user' ? 'user' : 'team-member';
    cachedRoles.set(cacheKey, role);
    return role;
}

/**
 * Check if a ticket is closed or solved.
 */
function isTicketClosed(ticket: ZendeskTicket) {
    return ticket.status === 'closed' || ticket.status === 'solved';
}
