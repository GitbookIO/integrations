import { GitBookAPI, IntegrationInstallation } from '@gitbook/api';

import type { GitHubAccountConfiguration, GithubRuntimeContext } from './types';

/**
 * Get the account configuration for the current installation.
 * This will throw an error if the installation configuration is not defined.
 */
export function getAccountConfigOrThrow(
    installation: IntegrationInstallation
): GitHubAccountConfiguration {
    const config = installation.configuration as GitHubAccountConfiguration | undefined;
    assertIsDefined(config, { label: 'installationConfiguration' });
    return config;
}

/**
 * Parse the GitHub installation ID from the installation string.
 * This will `throw an error` if the installation is not defined.
 */
export function parseInstallationOrThrow(input: GitHubAccountConfiguration | string): number {
    const installation = typeof input === 'string' ? input : input.installation;
    assertIsDefined(installation, { label: 'installation' });

    return parseInt(installation, 10);
}

/**
 * Authenticate as an integration installation using the installation ID.
 * Returns a new context with the auth token set.
 */
export async function authenticateAsIntegrationInstallation(
    context: GithubRuntimeContext,
    integrationName: string,
    installationId: string
): Promise<GithubRuntimeContext> {
    const {
        data: { token },
    } = await context.api.integrations.createIntegrationInstallationToken(
        integrationName,
        installationId
    );

    return {
        ...context,
        api: new GitBookAPI({
            endpoint: context.environment.apiEndpoint,
            authToken: token,
        }),
    };
}

export async function authenticateAsIntegration(
    context: GithubRuntimeContext
): Promise<GithubRuntimeContext> {
    return {
        ...context,
        api: new GitBookAPI({
            endpoint: context.environment.apiEndpoint,
            authToken: context.environment.apiTokens.integration,
        }),
    };
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
