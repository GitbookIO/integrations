import type { SlashEvent } from './commands';

export async function searchInGitBook(slashEvent: SlashEvent) {
    // const { team_id, text } = slashEvent;
    // // Lookup the concerned installations
    // const {
    //     data: { items: installations },
    // } = await api.integrations.listIntegrationInstallations(environment.integration.name, {
    //     externalId: team_id,
    // });
    // /**
    //  * TODO: Prompt user to select a GitBook installation if there is more than one.
    //  * by showing org names in a dropdown and asking user to pick one
    //  */
    // const installation = installations[0];
    // if (!installation) {
    //     return {};
    // }
    // // Authentify as the installation
    // const installationApiClient = await api.createInstallationClient(
    //     environment.integration.name,
    //     installation.id
    // );
    // const {
    //     data: { items },
    // } = await installationApiClient.search.searchContent({ query: text, limit: 10 });
}
