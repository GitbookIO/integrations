import Conf from 'conf';

import { GITBOOK_DEFAULT_ENDPOINT } from '@gitbook/api';
import { DEFAULT_ENV, getEnvironment } from './environments';

interface CliConfig {
    /**
     * Endpoint for the API.
     * @deprecated Use `envs.default.endpoint` instead.
     */
    endpoint: string;
    /**
     * Token to use for authentication.
     * @deprecated Use `envs.default.token` instead.
     */
    token?: string;

    /**
     * Environment configured.
     */
    envs: Record<
        string,
        {
            /**
             * API endpoint to authenticate to.
             */
            endpoint: string;
            /**
             * API token to authenticate with.
             */
            token?: string;
        }
    >;
}

/**
 * Config preserved in the user's home directory.
 */
export const config = new Conf<CliConfig>({
    projectName: 'gitbook',
    defaults: {
        endpoint: GITBOOK_DEFAULT_ENDPOINT,
        token: undefined,
        envs: {
            default: {
                endpoint: GITBOOK_DEFAULT_ENDPOINT,
                token: undefined,
            },
        },
    },
});

/**
 * Save the authentication to use for the given environment.
 */
export function saveAuthConfig(authConfig: { endpoint: string; token?: string }): void {
    const env = getEnvironment();
    config.set(`envs.${env}`, authConfig);
}

/**
 * Get the authentication to use for the given environment.
 */
export function getAuthConfig(): {
    endpoint: string;
    token?: string;
} {
    const env = getEnvironment();
    if (process.env.GITBOOK_TOKEN) {
        return {
            endpoint: process.env.GITBOOK_ENDPOINT || GITBOOK_DEFAULT_ENDPOINT,
            token: process.env.GITBOOK_TOKEN,
        };
    }

    const envConfig = config.get('envs')[env];
    if (envConfig) {
        return envConfig;
    }
    if (!envConfig && env !== DEFAULT_ENV) {
        throw new Error(`Environment "${env}" not found`);
    }

    const deprecatedEndpoint = config.get('endpoint');
    const deprecatedToken = config.get('token');
    if (deprecatedEndpoint && deprecatedToken) {
        return {
            endpoint: deprecatedEndpoint,
            token: deprecatedToken,
        };
    }

    return {
        endpoint: GITBOOK_DEFAULT_ENDPOINT,
        token: undefined,
    };
}
