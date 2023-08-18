import { FetchEventCallback } from '@gitbook/runtime';

import { SlackRuntimeContext } from './configuration';

export interface SlashEvent {
    /** Slack App's unique ID */
    api_app_id: string;
    /** ID of the slack workspace */
    team_id: string;
    /** ID of the channel where the command was triggered  */
    channel_id: string;
    /** ID when the workspace is part of an Enterprise Grid */
    enterprise_id?: string;
    /** A short-lived ID that will let your app open a modal */
    trigger_id: string;
    /** The ID of the user who triggered the command */
    user_id: string;
    /** The command that was typed in to trigger this request. For ex - `/gitbook` */
    command: string;
    /** This is the part of the Slash Command after the command itself */
    text: string;
    /** A temporary webhook URL that you can use to generate messages responses.
     * Reference - https://api.slack.com/interactivity/handling#message_responses
     */
    response_url: string;
}

export function createSlackCommandsHandler(handlers: {
    [type: string]: (slashEvent: SlashEvent, context: SlackRuntimeContext) => Promise<any>;
}): FetchEventCallback {
    return async (request, context) => {
        const requestText = await request.text();

        const slashEvent: SlashEvent = Object.fromEntries(
            new URLSearchParams(requestText).entries()
        );

        let event: SlashEvent;

        event = slashEvent;

        const { command } = event;

        if (!command) {
            return new Response(`Invalid slash command`, {
                status: 422,
            });
        }

        const handler = handlers[command];
        if (!handler) {
            return new Response(`No handler for slash command "${command}"`, {
                status: 404,
            });
        }

        const data = await handler(event, context);

        return new Response(null, {
            status: 200,
        });
    };
}
