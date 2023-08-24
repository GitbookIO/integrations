import { type IQueryLens } from './actions/queryLens';
import { saveThread } from './actions/saveThread';
import { getActionNameAndType, parseActionPayload } from './utils';

/**

 * Handle an action from Slack.
 */
export function createSlackActionsHandler(
    handlers: {
        // [type: string]: (event: object, context: SlackRuntimeContext) => Promise<any>;
        [type: string]: (...args: any) => Promise<any>;
    }
    // TODO: type output
): any {
    return async (request, context) => {
        const actionPayload = await parseActionPayload(request);

        const { actions, container, channel, message, team, user } = actionPayload;

        // go through all actions sent and call the action from './actions/index.ts'
        if (actions?.length > 0) {
            const action = actions[0];
            const { actionName, actionPostType } = getActionNameAndType(action.action_id);

            // TODO: need a more polymorphic solve here if possible
            const params: IQueryLens = {
                channelId: channel.id,
                teamId: team.id,
                text: action.value ?? action.text.text,
                messageType: actionPostType,

                // pass thread if exists
                ...(container.thread_ts ? { threadId: container.thread_ts } : {}),
                // pass user if exists
                ...(user.id ? { userId: user.id } : {}),

                context,
            };

            // queryLens:ephemeral, queryLens:permanent
            return await handlers[actionName](params);
        }

        // TODO: here to not break the current documenting of conversations
        return saveThread({
            teamId: team.id,
            channelId: channel.id,
            thread_ts: message.thread_ts,
            userId: user.id,
            context,
        });
    };
}
