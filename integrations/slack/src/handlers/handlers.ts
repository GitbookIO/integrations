import { Logger } from '@gitbook/runtime';

import type { SlashEvent } from './commands';
import { queryAskAI } from '../actions';
import { SlackRuntimeContext } from '../configuration';
import { isAllowedToRespond, stripBotName } from '../utils';

const logger = Logger('slack:api');

/**
 * Handle a slash request and route it to the GitBook AskAI' query function.
 */
export async function queryAskAISlashHandler(slashEvent: SlashEvent, context: SlackRuntimeContext) {
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
            text,
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
            text: parsedQuery,
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
 * Handle an Event request and route it to either GitBook AskAI' query function or saveThread function.
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
            text: parsedMessage,
            context,
            // @ts-ignore
            authorization: eventPayload.authorizations[0],
        });
    }
}
