import { Logger } from '@gitbook/runtime';
import { queryAskAI, type AskAIActionParams } from '../actions';
import { SlackRuntimeContext } from '../configuration';
import { getActionNameAndType, parseActionPayload } from '../utils';

const logger = Logger('slack:actions:handler');

/**
 * Handle an action from Slack.
 * Actions are defined within a block using Slack's "action_id" and are usually in the form of "functionName:messageType"
 */
export const slackActionsHandler = async (request: Request, context: SlackRuntimeContext) => {
    const actionPayload = await parseActionPayload(request);

    const { actionName, actionPostType } = getActionNameAndType(actionPayload);
    const { actions, container, channel, team, user, message_ts, response_url } = actionPayload;

    switch (actionName) {
        case 'queryAskAI': {
            const action = actions[0];
            const params: AskAIActionParams = {
                channelId: channel.id,
                teamId: team.id,
                queryText: action.value ?? action.text.text,
                messageType: actionPostType as 'ephemeral' | 'permanent',

                // pass thread if exists
                ...(container.thread_ts ? { threadId: container.thread_ts } : {}),
                // pass user if exists
                ...(user.id ? { userId: user.id } : {}),

                context,
            };

            context.waitUntil(queryAskAI(params));

            return;
        }
        default:
            logger.debug(`No matching handler for action: ${actionName}`);
    }
};
