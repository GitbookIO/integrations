import {
    type FetchEvent as GitBookFetchEvent,
    GitBookAPI,
    IntegrationEnvironment,
} from '@gitbook/api';

import { ExposableError } from './errors';

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

export interface RuntimeContext<
    Environment extends RuntimeEnvironment = IntegrationEnvironment,
    TaskPayload extends object = object,
> {
    /**
     * Environment of the integration.
     */
    environment: Environment;

    /**
     * Authenticated client to the GitBook API.
     * Depending on the context, this can be the integration client or the installation client.
     */
    api: GitBookAPI;

    /**
     * Context about the integration.
     */
    integration: {
        /**
         * Authenticated client to the GitBook API for the integration.
         */
        api: GitBookAPI;

        /**
         * Queue an integration task.
         */
        queueTask(input: {
            /** Payload for the integration task */
            task: TaskPayload;
            /**
             * Number of seconds to wait before executing the task, defaults to 0
             * @min 0
             * @max 86400
             */
            schedule?: number;
        }): Promise<void>;
    };

    /**
     * Wait for any pending promises to complete before finishing the execution.
     * Use this function for any side-effects in your handlers that are not awaited, but must finish before
     * the execution context is closed.
     */
    waitUntil: FetchEvent['waitUntil'];

    /**
     * GitBook user who sent the request, verified by GitBook.
     *
     * Only set for `fetch` events sent from the GitBook app with the user's ID token. For a request
     * to an installation, space installation or site installation URL, GitBook has also checked
     * that the user is an admin of that installation. For a request to the integration URL, the
     * user can be any GitBook user, or an admin of the integration if it's private.
     *
     * Use `assertAuthenticated` to require it.
     */
    auth?: RuntimeAuth;
}

/**
 * Verified GitBook user who sent a fetch request.
 */
export type RuntimeAuth = NonNullable<GitBookFetchEvent['auth']>;

/**
 * Extract the task payload type from a context.
 */
export type ExtractTaskPayload<Context extends RuntimeContext> = Parameters<
    Context['integration']['queueTask']
>[0]['task'];

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
    auth?: RuntimeAuth,
): RuntimeContext {
    const integrationAPI = new GitBookAPI({
        endpoint: environment.apiEndpoint,
        authToken: environment.apiTokens.integration,
        userAgent: `integration-${environment.integration.name}/${environment.integration.version}`,
    });

    return {
        environment,
        api: new GitBookAPI({
            endpoint: environment.apiEndpoint,
            authToken: environment.apiTokens.installation ?? environment.apiTokens.integration,
            userAgent: `integration-${environment.integration.name}/${environment.integration.version}`,
        }),

        integration: {
            api: integrationAPI,
            queueTask: async (input) => {
                await integrationAPI.integrations.queueIntegrationTask(
                    environment.integration.name,
                    {
                        task: input.task as Record<string, string>,
                        schedule: input.schedule,
                    },
                );
            },
        },

        waitUntil,

        ...(auth ? { auth } : {}),
    };
}

/**
 * Assert that the request comes from a GitBook user verified by GitBook (see `RuntimeContext.auth`).
 * Throws a 401 error otherwise.
 */
export function assertAuthenticated<Context extends RuntimeContext>(
    context: Context,
): asserts context is Context & { auth: RuntimeAuth } {
    if (!context.auth) {
        throw new ExposableError('Authentication required', 401);
    }
}
