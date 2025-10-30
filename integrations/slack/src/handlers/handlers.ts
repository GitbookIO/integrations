import { Logger } from '@gitbook/runtime';

import type { SlashEvent } from './commands';
import { ingestSlackConversation, queryAskAI } from '../actions';
import { SlackRuntimeContext } from '../configuration';
import { isAllowedToRespond, stripBotName } from '../utils';

const logger = Logger('slack:handlers');

//
// Command handlers
//

/**
 * Handle /gitbook slack command request by routing to the correct subcommand handler.
 */
export async function gitbookCommandHandler(slashEvent: SlashEvent, context: SlackRuntimeContext) {
    const { subcommand, subcommandText } = parseGitBookCommand(slashEvent.text);

    switch (subcommand) {
        case 'ingest':
            return ingestConversationSubCommandHandler(
                { ...slashEvent, text: subcommandText },
                context,
            );
        case 'ask':
        default:
            return askAISubCommandHandler(
                {
                    ...slashEvent,
                    text: subcommandText,
                },
                context,
            );
    }
}

/**
 * Handle an ingest slack conversation subcommand.
 */
async function ingestConversationSubCommandHandler(
    slashEvent: SlashEvent,
    context: SlackRuntimeContext,
) {
    const { team_id, channel_id, channel_name, user_id, thread_ts, response_url, text } =
        slashEvent;

    return ingestSlackConversation({
        channelId: channel_id,
        channelName: channel_name,
        responseUrl: response_url,
        teamId: team_id,
        threadId: thread_ts,
        userId: user_id,
        context,
        text,
    });
}

/**
 * Handle an askAI subcommand.
 */
async function askAISubCommandHandler(slashEvent: SlashEvent, context: SlackRuntimeContext) {
    // pull out required params from the slashEvent for queryAskAI
    const { team_id, channel_id, thread_ts, user_id, text, channel_name, response_url } =
        slashEvent;

    try {
        return queryAskAI({
            channelId: channel_id,
            channelName: channel_name,
            responseUrl: response_url,
            teamId: team_id,
            threadId: thread_ts,
            queryText: text,
            context,
            userId: user_id,
            messageType: 'ephemeral',
        });
    } catch (e) {
        // Error state. Probably no installation was found
        logger.error('Error calling queryAskAI. Perhaps no installation was found?');
        return {};
    }
}

const GITBOOK_COMMANDS = ['ask', 'ingest', 'help'] as const;
type GitBookCommand = (typeof GITBOOK_COMMANDS)[number];

function isGitBookCommand(value: string): value is GitBookCommand {
    return (GITBOOK_COMMANDS as readonly string[]).includes(value);
}

function parseGitBookCommand(commandText: string): {
    subcommand: GitBookCommand;
    subcommandText: string;
} {
    const tokens = commandText.trim().split(/\s+/);
    const subcommand = tokens[0];

    if (isGitBookCommand(subcommand)) {
        return {
            subcommand,
            subcommandText: tokens.slice(1).join(' '),
        };
    }

    return {
        subcommand: 'ask',
        subcommandText: commandText,
    };
}

//
// Event handlers
//

/**
 * Handle an Event request and route it to the GitBook AskAI' query function.
 */
export async function messageEventHandler(eventPayload: any, context: SlackRuntimeContext) {
    // pull out required params from the event for queryAskAI
    const { type, text, thread_ts, channel, user, team } = eventPayload.event;

    // check for bot_id so that the bot doesn't trigger itself
    if (['message', 'app_mention'].includes(type) && isAllowedToRespond(eventPayload)) {
        // strip out the bot-name in the mention and account for user mentions within the query
        // @ts-ignore
        const parsedQuery = stripBotName(text, eventPayload.authorizations[0]?.user_id);

        // send to AskAI
        await queryAskAI({
            teamId: team,
            channelId: channel,
            threadId: thread_ts,
            userId: user,
            messageType: 'permanent',
            queryText: parsedQuery,
            context,
            // @ts-ignore
            authorization: eventPayload.authorizations[0],
        });
    }

    // Add custom header(s)
    return new Response(null, {
        status: 200,
    });
}

/**
 * Handle an Event request and route it to AskAI's query function.
 */
export async function appMentionEventHandler(eventPayload: any, context: SlackRuntimeContext) {
    // pull out required params from the slashEvent for queryAskAI
    const { type, text, thread_ts, channel, user, team } = eventPayload.event;

    // check for bot_id so that the bot doesn't trigger itself
    if (['message', 'app_mention'].includes(type) && isAllowedToRespond(eventPayload)) {
        // strip out the bot-name in the mention and account for user mentions within the query
        // @ts-ignore
        const parsedMessage = stripBotName(text, eventPayload.authorizations[0]?.user_id);

        // send to AskAI
        await queryAskAI({
            teamId: team,
            channelId: channel,
            threadId: thread_ts,
            userId: user,
            messageType: 'permanent',
            queryText: parsedMessage,
            context,
            // @ts-ignore
            authorization: eventPayload.authorizations[0],
        });
    }
}
