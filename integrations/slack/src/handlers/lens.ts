import { Logger } from '@gitbook/runtime';

import { queryLens } from '../actions';
import { SlackRuntimeContext } from '../configuration';
import { stripBotName } from '../utils';
import type { SlashEvent } from './commands';

const logger = Logger('slack:api');

/**
 * Handle a slash request and route it to the GitBook Lens' query function.
 */
export async function queryLensSlashHandler(slashEvent: SlashEvent, context: SlackRuntimeContext) {
    // pull out required params from the slashEvent for queryLens
    const { team_id, channel_id, thread_ts, user_id, text } = slashEvent;

    try {
        return queryLens({
            channelId: channel_id,
            teamId: team_id,
            threadId: thread_ts,
            text,
            context,
            userId: user_id,
            messageType: 'ephemeral',
        });
    } catch (e) {
        // Error state. Probably no installation was found
        logger.error('Error calling queryLens. Perhasp no installation was found?');
        return {};
    }
}

/**
 * Handle an Event request and route it to the GitBook Lens' query function.
 */
export async function queryLensEventHandler(eventPayload: any, context: SlackRuntimeContext) {
    // pull out required params from the slashEvent for queryLens
    const { type, text, bot_id, thread_ts, channel, user, team_id } = eventPayload.event;

    // check for bot_id so that the bot doesn't trigger itself
    if (['message', 'app_mention'].includes(type) && !bot_id) {
        // strip out the bot-name in the mention and account for user mentions within the query
        // @ts-ignore
        const parsedQuery = stripBotName(text, eventPayload.authorizations[0]?.user_id);

        // send to Lens
        await queryLens({
            teamId: team_id,
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
