import Conf from 'conf';

import { GITBOOK_DEFAULT_ENDPOINT } from '@gitbook/api';

/**
 * Config preserved in the user's home directory.
 */
export const config = new Conf<{
    /**
     * Endpoint for the API.
     */
    endpoint: string;
    /**
     * Token to use for authentication.
     */
    token?: string;
}>({
    projectName: 'gitbook',
    defaults: {
        endpoint: process.env.GITBOOK_ENDPOINT || GITBOOK_DEFAULT_ENDPOINT,
        token: process.env.GITBOOK_TOKEN,
    },
});
