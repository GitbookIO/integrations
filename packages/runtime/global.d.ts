export {};

declare global {
    /**
     * Environment variable for the worker. Exists in the global scope.
     * https://developers.cloudflare.com/workers/platform/environment-variables/
     */
    const MODE: 'production' | 'development';
}
