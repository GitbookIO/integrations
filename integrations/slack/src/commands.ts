import { Request } from 'itty-router';

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
    [type: string]: (slashEvent: SlashEvent) => Promise<any>;
}): (request: Request) => Promise<Response> {
    return async (request) => {
        const slashEvent = {} as SlashEvent;
        new URLSearchParams(await request.text()).forEach((value, key) => {
            slashEvent[key] = value;
        });

        if (!slashEvent.command) {
            return new Response(`Invalid slash command`, {
                status: 422,
            });
        }

        const { command } = slashEvent;

        const handler = handlers[command];
        if (!handler) {
            return new Response(`No handler for slash command "${command}"`, {
                status: 404,
            });
        }

        await handler(slashEvent);

        return new Response(null, {
            status: 200,
        });
    };
}
