import { queryLens } from '../actions/queryLens';
import type { SlashEvent } from '../commands';
import { SlackRuntimeContext } from '../configuration';

/**
 * Query GitBook Lens and post a message back to Slack.
 */
export async function queryLensSlashHandler(slashEvent: SlashEvent, context: SlackRuntimeContext) {
    const { environment, api } = context;
    const { team_id, channel_id, text } = slashEvent;

    // Lookup the concerned installations
    const {
        data: { items: installations },
    } = await api.integrations.listIntegrationInstallations(environment.integration.name, {
        externalId: team_id,
    });

    /**
     * TODO: Prompt user to select a GitBook installation if there is more than one.
     * by showing org names in a dropdown and asking user to pick one
     */
    const installation = installations[0];
    if (!installation) {
        return {};
    }

    try {
        return queryLens({
            channelId: channel_id,
            teamId: team_id,
            text,
            context,
        });
    } catch (e) {
        // Error state. Probably no installation was found
        return {};
    }
}
