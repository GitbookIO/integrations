import { Logger } from '@gitbook/runtime';

import type { SlashEvent } from './commands';
import { inferUserIntentAndTriggerAction, ingestSlackConversation, queryAskAI } from '../actions';
import { SlackRuntimeContext } from '../configuration';
import { isAllowedToRespond, stripBotName } from '../utils';

const logger = Logger('slack:handlers');

//
// Command handlers
//

/**
 * Handle an askAI subcommand.
 */
export async function askAICommandHandler(slashEvent: SlashEvent, context: SlackRuntimeContext) {
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
    const { type, text, channel, ts, thread_ts, user, team } = eventPayload.event;

    // check for bot_id so that the bot doesn't trigger itself
    if (['message', 'app_mention'].includes(type) && isAllowedToRespond(eventPayload)) {
        // strip out the bot-name in the mention and account for user mentions within the query
        // @ts-ignore
        const parsedMessage = stripBotName(text, eventPayload.authorizations[0]?.user_id);

        context.waitUntil(
            inferUserIntentAndTriggerAction(
                {
                    channelId: channel,
                    threadTs: thread_ts ?? ts,
                    userId: user,
                    teamId: team,
                    userMessage: parsedMessage,
                    authorization: eventPayload.authorizations[0],
                },
                context,
            ),
        );
    }
}
