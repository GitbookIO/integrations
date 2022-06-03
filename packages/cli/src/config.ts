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
        endpoint: GITBOOK_DEFAULT_ENDPOINT,
    },
});
