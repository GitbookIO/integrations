import removeMarkdown from 'remove-markdown';

import { IntegrationInstallation } from '@gitbook/api';

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
    const event = (await req.clone().json()) as {
        event?: { type: string; [key: string]: any };
        type?: string;
        bot_id?: string;
        is_ext_shared_channel?: boolean;
    };

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

/**
 * Extracts the action name and type from a Slack interaction payload.
 *
 * This function supports both shortcut and block action payloads:
 * - Shortcuts can be triggered from menus such as the "More actions" button on messages.
 * - Block actions come from interactive Block Kit components.
 *
 * Because all these events are handled as "actions" in the integration, this helper
 * centralizes how we derive the action name and type from the event payload.
 */
export function getActionNameAndType(payload: any) {
    let actionId: string | undefined;

    if (payload?.type === 'block_actions' && payload.actions?.length > 0) {
        actionId = payload.actions[0].action_id;
    } else if (
        payload?.type === 'shortcut' ||
        payload?.type === 'message_action' ||
        payload?.type === 'global_shortcut'
    ) {
        actionId = payload.callback_id;
    }

    if (!actionId) {
        throw new Error('Unable to extract action identifier from payload');
    }

    const [actionName, actionPostType] = actionId.split(':');

    return { actionName, actionPostType };
}

// Checks whether we should respond to a slack event
export function isAllowedToRespond(eventPayload: any) {
    const isFromBot = Boolean(eventPayload.event?.bot_id);
    const isExternalChannel = eventPayload.is_ext_shared_channel;

    return !isFromBot && !isExternalChannel;
}

/**
 * Check if Docs agents conversation is enabled for the organization.
 *
 * TODO: Remove when Docs agents reached general availability.
 */
export async function isDocsAgentsConversationsEnabled(params: {
    organizationId: string;
    context: SlackRuntimeContext;
}): Promise<boolean> {
    const { organizationId, context } = params;
    try {
        const response = await fetch(
            `https://front.reflag.com/features/enabled?context.company.id=${organizationId}&key=DOCS_AGENTS_CONVERSATIONS`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${context.environment.secrets.REFLAG_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        const json = (await response.json()) as {
            features: { DOCS_AGENTS_CONVERSATIONS: { isEnabled: boolean } };
        };
        const flag = json.features.DOCS_AGENTS_CONVERSATIONS;

        return flag.isEnabled;
    } catch (e) {
        return false;
    }
}
