import Conf from 'conf';

import { GITBOOK_DEFAULT_ENDPOINT } from '@gitbook/api';

interface CliConfig {
    /**
     * Endpoint for the API.
     */
    endpoint: string;
    /**
     * Token to use for authentication.
     */
    token?: string;
}

/**
 * Config preserved in the user's home directory.
 */
const config = new Conf<CliConfig>({
    projectName: 'gitbook',
    defaults: {
        endpoint: GITBOOK_DEFAULT_ENDPOINT,
        token: undefined,
    },
});

/**
 * Get a value from the config file, but prioritize the environment variable.
 */
export function getConfigValue(key: keyof CliConfig): string | undefined {
    const envName = `GITBOOK_${key.toUpperCase()}`;
    const envValue = process.env[envName];
    if (envValue !== undefined) {
        return envValue;
    }

    return config.get(key);
}

/**
 * Set a value in the config file.
 */
export function setConfigValue<Key extends keyof CliConfig>(key: Key, value: CliConfig[Key]): void {
    config.set(key, value);
}
