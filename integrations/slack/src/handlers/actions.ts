import { type IQueryAskAI } from '../actions';
import { SlackRuntimeContext } from '../configuration';
import { getActionNameAndType, parseActionPayload } from '../utils';

/**

 * Handle an action from Slack.
 * Actions are defined within a block using Slack's "action_id" and are usually in the form of "functionName:messageType"
 */
export function createSlackActionsHandler(
    handlers: {
        [type: string]: (event: object) => Promise<any>;
    },
    // TODO: type output
) {
    return async (request: Request, context: SlackRuntimeContext) => {
        const actionPayload = await parseActionPayload(request);

        const { actions, container, channel, team, user } = actionPayload;

        // go through all actions sent and call the action from './actions/index.ts'
        if (actions?.length > 0) {
            const action = actions[0];
            const { actionName, actionPostType } = getActionNameAndType(action.action_id);

            // dispatch the action to an appropriate action function
            if (actionName === 'queryAskAI') {
                const params: IQueryAskAI = {
                    channelId: channel.id,
                    teamId: team.id,
                    text: action.value ?? action.text.text,
                    messageType: actionPostType as 'ephemeral' | 'permanent',

                    // pass thread if exists
                    ...(container.thread_ts ? { threadId: container.thread_ts } : {}),
                    // pass user if exists
                    ...(user.id ? { userId: user.id } : {}),

                    context,
                };

                // queryAskAI:ephemeral, queryAskAI:permanent
                const handlerPromise = handlers[actionName](params);

                context.waitUntil(handlerPromise);
            }
        }
    };
}
