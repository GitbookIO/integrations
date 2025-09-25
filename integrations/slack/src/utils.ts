import removeMarkdown from 'remove-markdown';

import { GitBookAPI, IntegrationInstallation } from '@gitbook/api';

import { SlackInstallationConfiguration, SlackRuntimeContext } from './configuration';

export function stripMarkdown(text: string) {
    return removeMarkdown(text);
}

/**
 * Fetch the integration installation for a given slack team ID
 *
 * TODO: there's a HARD limitation on having one slack team per gitbook org.
 */
export async function getIntegrationInstallationForTeam(
    context: SlackRuntimeContext,
    teamId: string,
): Promise<IntegrationInstallation | null> {
    const {
        data: { items: installations },
    } = await context.api.integrations.listIntegrationInstallations('slack', {
        externalId: teamId,

        // we need to pass installation.target.organization
    });

    // won't work for multiple installations accross orgs and same slack team
    const installation = installations.at(0);
    if (!installation) {
        return null;
    }

    return installation;
}

/**
 *  Get the installation API client for a integration installation
 */
export async function getInstallationApiClient(
    context: SlackRuntimeContext,
    installationId: string,
) {
    // Authentify as the installation
    return await context.api.createInstallationClient('slack', installationId);
}

export async function getInstallationConfig(context: SlackRuntimeContext, externalId: string) {
    const { api, environment } = context;

    // Lookup the concerned installations
    // cache this?
    const {
        data: { items: installations },
    } = await api.integrations.listIntegrationInstallations(environment.integration.name, {
        externalId,
    });

    /**
     * TODO: Prompt user to select a GitBook installation if there is more than one.
     * by showing org names in a dropdown and asking user to pick one
     */
    const installation = installations[0];
    if (!installation) {
        return {};
    }

    const accessToken = (installation.configuration as SlackInstallationConfiguration)
        .oauth_credentials?.access_token;

    return {
        accessToken,
        installation,
    };
}

export async function parseEventPayload(req: Request) {
    // Clone the request so its body is still available to the fallback
    const event = await req.clone().json<{
        event?: { type: string; [key: string]: any };
        type?: string;
        bot_id?: string;
        is_ext_shared_channel?: boolean;
    }>(); // TODO: untyping this for now

    return event;
}

export async function parseCommandPayload(req: Request) {
    // Clone the request so its body is still available to the fallback
    const requestText = await req.clone().text();

    const event = Object.fromEntries(new URLSearchParams(requestText).entries());

    return event;
}

export async function parseActionPayload(req: Request) {
    // Clone the request so its body is still available to the fallback// Clone the request so its body is still available to the fallback
    const requestText = await req.clone().text();

    const shortcutEvent = Object.fromEntries(new URLSearchParams(requestText).entries());
    const shortcutPayload = JSON.parse(shortcutEvent.payload);

    return shortcutPayload;
}

export function stripBotName(text: string, botName: string) {
    return text.split(new RegExp(`^.*<@${botName}> `)).join('');
}

export function getActionNameAndType(actionId: string) {
    const [actionName, actionPostType = 'ephemeral'] = actionId.split(':');

    return { actionName, actionPostType };
}

// Checks whether we should respond to a slack event
export function isAllowedToRespond(eventPayload: any) {
    const isFromBot = Boolean(eventPayload.event?.bot_id);
    const isExternalChannel = eventPayload.is_ext_shared_channel;

    return !isFromBot && !isExternalChannel;
}

/**
 * Convert an array buffer to a hex string
 */
export function arrayToHex(arr: ArrayBuffer) {
    return [...new Uint8Array(arr)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Constant-time string comparison. Equivalent of `crypto.timingSafeEqual`.
 **/
export function safeCompare(expected: string, actual: string) {
    const lenExpected = expected.length;
    let result = 0;

    if (lenExpected !== actual.length) {
        actual = expected;
        result = 1;
    }

    for (let i = 0; i < lenExpected; i++) {
        result |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
    }

    return result === 0;
}
