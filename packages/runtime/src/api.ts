import { GitBookAPI } from '@gitbook/api';

/**
 * Initialized API client authenticated with the integration credentials.
 */
export const api = new GitBookAPI({
    endpoint: environment.apiEndpoint,
    authToken: environment.authToken,
});
