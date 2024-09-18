import { StatusError } from 'itty-router';

import removeMarkdown from 'remove-markdown';

import { GitBookAPI } from '@gitbook/api';

import { SlackOrgInstallationConfiguration, SlackRuntimeContext } from './configuration';
import { FullInstallationConfiguration } from './types';

const SAVE_THREAD_MESSAGE = 'save';

export function stripMarkdown(text: string) {
    return removeMarkdown(text);
}

/**
 *  Get the installation API client for a given slack org and gitbook org combination
 *
 * TODO: there's a HARD limitation on having one slack team per gitbook org.
 */
export async function getInstallationApiClient(api: GitBookAPI, externalId: string) {
    const {
        data: { items: installations },
    } = await api.integrations.listIntegrationInstallations('slack', {
        externalId,

        // we need to pass installation.target.organization
    });

    // won't work for multiple installations accross orgs and same slack team
    const installation = installations[0];
    if (!installation) {
        return {};
    }

    // Authentify as the installation
    const installationApiClient = await api.createInstallationClient('slack', installation.id);

    return { client: installationApiClient, installation };
}

export async function getInstallationConfig(context, externalId) {
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

    const accessToken = (installation.configuration as SlackOrgInstallationConfiguration)
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

export function isSaveThreadMessage(message: string) {
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

// Checks whether we should respond to a slack event
export function isAllowedToRespond(eventPayload: any) {
    const { bot_id } = eventPayload.event;
    const isExternalChannel = eventPayload.is_ext_shared_channel;

    return !bot_id && !isExternalChannel;
}

export type OAuthTokenCredentials = NonNullable<FullInstallationConfiguration['oauth_credentials']>;

/**
 * Extract the token credentials of the space installation configuration from the context
 * This will throw an error if the access token is not defined.
 */
export function extractTokenCredentialsOrThrow(
    context: SlackRuntimeContext
): OAuthTokenCredentials {
    const installation = context.environment.installation;
    assertIsDefined(installation, {
        label: 'spaceInstallation',
    });

    const config = installation.configuration;
    assertIsDefined(config, { label: 'installationConfiguration' });

    const oAuthCredentials = config?.oauth_credentials;
    if (!oAuthCredentials?.access_token) {
        throw new StatusError(401, 'Unauthorized: kindly re-authenticate!');
    }

    return oAuthCredentials;
}

export function assertIsDefined<T>(
    value: T,
    options: {
        label: string;
    }
): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        throw new Error(`Expected value (${options.label}) to be defined, but received ${value}`);
    }
}
