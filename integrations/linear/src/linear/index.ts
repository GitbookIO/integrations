import { LinearInstallationConfiguration } from '../types';
import { GraphQLClient } from 'graphql-request';
import { getSdk } from './gql/graphql';

const LINEAR_GRAPHQL_ENDPOINT = 'https://api.linear.app/graphql';
const LINEAR_UNFURL_DOMAIN = 'linear.app';

/**
 * Extract the details of a Linear issue from its link.
 */
export function extractLinearIssueIdFromLink(link: string): string {
    const url = new URL(link);

    if (url.host !== LINEAR_UNFURL_DOMAIN) {
        return;
    }

    const [, issuePath, issueId] = url.pathname.split('/').slice(1);

    // Not an issue link
    if (issuePath !== 'issue') {
        return;
    }

    return issueId;
}

/**
 * Return Linear GraphQL API client.
 */
export async function getLinearAPIClient(configuration: LinearInstallationConfiguration) {
    const { oauth_credentials } = configuration;

    // Create a GQL client based passing the runtime fetch as custom fetch option
    const client = new GraphQLClient(LINEAR_GRAPHQL_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${oauth_credentials.access_token}`,
        },
        fetch,
    });
    const sdk = getSdk(client);

    return sdk;
}
