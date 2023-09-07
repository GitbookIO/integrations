import { type IQueryLens } from '../actions';
import { getActionNameAndType, parseActionPayload } from '../utils';

/**

 * Handle an action from Slack.
 * Actions are defined within a block using Slack's "action_id" and are usually in the form of "functionName:messageType"
 */
export function createSlackActionsHandler(
    handlers: {
        [type: string]: (event: object) => Promise<any>;
    }
    // TODO: type output
): any {
    return async (request, context) => {
        const actionPayload = await parseActionPayload(request);

        const { actions, container, channel, channel_name, team, user, response_url } =
            actionPayload;

        // go through all actions sent and call the action from './actions/index.ts'
        if (actions?.length > 0) {
            const action = actions[0];
            const { actionName, actionPostType } = getActionNameAndType(action.action_id);

            // TODO: using the response_url does not allow you to change the messageType (ie. ephemeral vs permanent).
            // if we are in a channel and using an action where we are trying to post into the channel via, share, we
            // need to skip using the response_url
            const dontUseResponseUrl =
                channel_name !== 'directmessage' && actionPostType !== 'ephemeral';

            // dispatch the action to an appropriate action function
            if (actionName === 'queryLens') {
                const params: IQueryLens = {
                    channelId: channel.id,
                    teamId: team.id,
                    text: action.value ?? action.text.text,
                    messageType: actionPostType as 'ephemeral' | 'permanent',

                    // pass thread if exists
                    ...(container.thread_ts ? { threadId: container.thread_ts } : {}),
                    // pass user if exists
                    ...(user.id ? { userId: user.id } : {}),

                    // if we have a response_url, we can reply safely using that
                    responseUrl: dontUseResponseUrl ? undefined : response_url,
                    context,
                };

                // queryLens:ephemeral, queryLens:permanent
                return await handlers[actionName](params);
            }
        }
    };
}
