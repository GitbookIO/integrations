import { GitBookAPI, IntegrationEnvironment } from '@gitbook/api';

export interface RuntimeEnvironment<
    InstallationConfiguration = {},
    SpaceInstallationConfiguration = {}
> extends IntegrationEnvironment {
    installation?: IntegrationEnvironment['installation'] & {
        configuration: InstallationConfiguration;
    };
    spaceInstallation?: IntegrationEnvironment['spaceInstallation'] & {
        configuration: SpaceInstallationConfiguration;
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
}

/**
 * Callback with the runtime context.
 */
export type RuntimeCallback<
    Input extends Array<any>,
    Result,
    Context extends RuntimeContext = RuntimeContext
> = (...args: [...Input, Context]) => Result;

/**
 * Create a new runtime context from an environment.
 */
export function createContext(environment: IntegrationEnvironment): RuntimeContext {
    return {
        environment,
        api: new GitBookAPI({
            endpoint: environment.apiEndpoint,
            authToken: environment.authToken,
        }),
    };
}
