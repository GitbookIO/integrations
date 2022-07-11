import * as gitbook from '@gitbook/api';
import { api } from '@gitbook/runtime';

import { executeSlackAPIRequest } from './api';

export async function searchInGitBook(slashEvent: object) {
    const { team_id, channel_id, command, text } = slashEvent;

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

    // Authentify as the installation
    const installationApiClient = await api.createInstallationClient(
        environment.integration.name,
        installation.id
    );

    // Search on all spaces of this installation
}
