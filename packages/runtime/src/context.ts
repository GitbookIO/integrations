import { GitBookAPI, IntegrationEnvironment } from '@gitbook/api';

export interface RuntimeContext {
    /**
     * Environment of the integration.
     */
    environment: IntegrationEnvironment;

    /**
     * Authenticated client to the GitBook API.
     */
    api: GitBookAPI;
}

/**
 * Callback with the runtime context.
 */
export type RuntimeCallback<Input extends Array<any>, Result> = (
    ...args: [...Input, RuntimeContext]
) => Result;

/**
 * Create a mnewew runtime context from an environment.
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
