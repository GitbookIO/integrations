import { Logger } from '@gitbook/runtime';

import { notifyOnlySupportedThreads, queryLens, saveThread } from '../actions';
import { SlackRuntimeContext } from '../configuration';
import { stripBotName } from '../utils';
import type { SlashEvent } from './commands';

const logger = Logger('slack:api');
const SAVE_THREAD_MESSAGE = 'save';

/**
 * Handle a slash request and route it to the GitBook Lens' query function.
 */
export async function queryLensSlashHandler(slashEvent: SlashEvent, context: SlackRuntimeContext) {
    // pull out required params from the slashEvent for queryLens
    const { team_id, channel_id, thread_ts, user_id, text, channel_name, response_url } =
        slashEvent;

    try {
        return queryLens({
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
        logger.error('Error calling queryLens. Perhaps no installation was found?');
        return {};
    }
}

/**
 * Handle an Event request and route it to the GitBook Lens' query function.
 */
export async function messageEventHandler(eventPayload: any, context: SlackRuntimeContext) {
    // pull out required params from the slashEvent for queryLens
    const { type, text, bot_id, thread_ts, channel, user, team } = eventPayload.event;

    // check for bot_id so that the bot doesn't trigger itself
    if (['message', 'app_mention'].includes(type) && !bot_id) {
        // strip out the bot-name in the mention and account for user mentions within the query
        // @ts-ignore
        const parsedQuery = stripBotName(text, eventPayload.authorizations[0]?.user_id);

        // send to Lens
        await queryLens({
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
 * Handle an Event request and route it to either GitBook Lens' query function or saveThread function.
 */
export async function appMentionEventHandler(eventPayload: any, context: SlackRuntimeContext) {
    // pull out required params from the slashEvent for queryLens
    const { type, text, bot_id, thread_ts, channel, user, team } = eventPayload.event;

    // check for bot_id so that the bot doesn't trigger itself
    if (['message', 'app_mention'].includes(type) && !bot_id) {
        // strip out the bot-name in the mention and account for user mentions within the query
        // @ts-ignore
        const parsedMessage = stripBotName(text, eventPayload.authorizations[0]?.user_id);

        console.log('parsedMessage====', parsedMessage);
        if (isSaveThreadMessage(parsedMessage)) {
            // not supported outside threads
            if (!thread_ts) {
                await notifyOnlySupportedThreads(context, team, channel, user);
                return;
            }

            await saveThread(
                {
                    teamId: team,
                    channelId: channel,
                    thread_ts,
                    userId: user,
                },
                context
            );

            return;
        }

        // send to Lens
        await queryLens({
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

    // Add custom header(s)
    return new Response(null, {
        status: 200,
    });
}

function isSaveThreadMessage(message: string) {
    const tokens = message.split(' ');

    if (tokens.length > 3) {
        return false;
    }

    const [first, second] = tokens;

    // `save` or `save this` or `please save`
    if (first === SAVE_THREAD_MESSAGE || second === SAVE_THREAD_MESSAGE) {
        return true;
    }

    return false;
}
