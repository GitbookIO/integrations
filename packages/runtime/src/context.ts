import { GitBookAPI, IntegrationEnvironment } from '@gitbook/api';

export interface RuntimeEnvironment<
    InstallationConfiguration = {},
    SpaceOrSiteInstallationConfiguration = {},
> extends IntegrationEnvironment {
    installation?: IntegrationEnvironment['installation'] & {
        configuration: InstallationConfiguration;
    };
    spaceInstallation?: IntegrationEnvironment['spaceInstallation'] & {
        configuration: SpaceOrSiteInstallationConfiguration;
    };
    siteInstallation?: IntegrationEnvironment['siteInstallation'] & {
        configuration: SpaceOrSiteInstallationConfiguration;
    };
}

export interface RuntimeContext<Environment extends RuntimeEnvironment = IntegrationEnvironment> {
    /**
     * Environment of the integration.
     */
    environment: Environment;

    /**
     * Authenticated client to the GitBook API.
     */
    api: GitBookAPI;

    /**
     * Wait for any pending promises to complete before finishing the execution.
     * Use this function for any side-effects in your handlers that are not awaited, but must finish before
     * the execution context is closed.
     */
    waitUntil: FetchEvent['waitUntil'];
}

/**
 * Callback with the runtime context.
 */
export type RuntimeCallback<
    Input extends Array<any>,
    Result,
    Context extends RuntimeContext = RuntimeContext,
> = (...args: [...Input, Context]) => Result;

/**
 * Create a new runtime context from an environment.
 */
export function createContext(
    environment: IntegrationEnvironment,
    waitUntil: FetchEvent['waitUntil'],
): RuntimeContext {
    return {
        environment,
        api: new GitBookAPI({
            endpoint: environment.apiEndpoint,
            authToken: environment.authToken,
            userAgent: `integration-${environment.integration.name}/${environment.integration.version}`,
        }),

        waitUntil,
    };
}
