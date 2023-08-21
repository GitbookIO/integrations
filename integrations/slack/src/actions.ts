import { FetchEventCallback } from '@gitbook/runtime';

import { type IQueryLens } from './actions/queryLens';
import { saveThread } from './actions/saveThread';
import { SlackRuntimeContext } from './configuration';
import { parseActionPayload } from './utils';

/**

 * Handle an action from Slack.
 */
export function createSlackActionsHandler(
    handlers: {
        // [type: string]: (event: object, context: SlackRuntimeContext) => Promise<any>;
        [type: string]: (...any) => Promise<any>;
    }
    // TODO: type output
): any {
    return async (request, context) => {
        const actionPayload = await parseActionPayload(request);

        console.log('actions payload====', actionPayload);
        const { actions, container, channel, message, team, user } = actionPayload;

        console.log('actions handler=====', actions);

        // go through all actions sent and call the action from './actions/index.ts'
        if (actions?.length > 0) {
            const action = actions[0];
            console.log('action handler=====', action);
            // TODO: need a more polymorphic solve here if possible
            const params: IQueryLens = {
                channelId: channel.id,
                teamId: team.id,
                text: action.value ?? action.text.text,

                // pass thread if exists
                ...(container.thread_ts ? { threadId: container.thread_ts } : {}),
                // pass user if exists
                ...(user.id ? { userId: user.id } : {}),

                context,
            };

            return await handlers[action.action_id](params);
            // const actionPromises = actions.map((action) => {
            //     console.log('action handler=====', action);
            //     // TODO: need a more polymorphic solve here if possible
            //     const params: IQueryLens = {
            //         channelId: channel.id,
            //         teamId: team.id,
            //         text: action.value ?? action.text.text,

            //         // pass thread if exists
            //         ...(container.thread_ts ? { threadId: container.thread_ts } : {}),
            //         // pass user if exists
            //         ...(user.id ? { userId: user.id } : {}),

            //         context,
            //     };

            //     return handlers[action.action_id](params);
            // });

            // return await Promise.allSettled(actionPromises);
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

//   token: '1W4r987ZaX2XbnrkVvfdEzQQ',
//   action_ts: '1692187902.226777',
//   team: { id: 'T032HV6MF', domain: 'gitbook' },
//   user: {
//     id: 'U03S41KSY8M',
//     username: 'valentino',
//     team_id: 'T032HV6MF',
//     name: 'valentino'
//   },
//   channel: { id: 'C05M1K6RTD4', name: 'tmp-slack-integration-valentino' },
//   is_enterprise_install: false,
//   enterprise: null,
//   callback_id: 'generate_docs',
//   trigger_id: '5749554069538.3085992729.84e5c8b2c3f206a0a64417a02cb6270d',
//   response_url: 'https://hooks.slack.com/app/T032HV6MF/5735015787015/6zzBIWRLpw6sm438oUpTxC2h',
//   message_ts: '1692106894.378009',
//   message: {
//     bot_id: 'B05MND68QVC',
//     type: 'message',
//     text: 'Hm, I had the case where it would hang at this point, but it was related to changes to our mySQL database and the CLI was waiting for a prompt answer (y/n) higher in the logs.\n' +
//       'Can you check if you have anything earlier that could be blocking too?',
//     user: 'U03S41KSY8M',
//     ts: '1692106894.378009',
//     app_id: 'A05M82VRGPM',
//     blocks: [ [Object] ],
//     team: 'T032HV6MF',
//     bot_profile: {
//       id: 'B05MND68QVC',
//       deleted: false,
//       name: 'GitBook (valentino-dev)',
//       updated: 1692103834,
//       app_id: 'A05M82VRGPM',
//       icons: [Object],
//       team_id: 'T032HV6MF'
//     },
//     thread_ts: '1692106894.088119',
//     parent_user_id: 'U03S41KSY8M'
//
