import { Integration, IntegrationInstallation } from '@gitbook/api';

declare global {
    /**
     *
     */
    interface GitBookEnvironment {
        /**
         * Current integration concerned by the event.
         */
        integration: Integration;

        /**
         * Current installation concerned by the event.
         */
        installation: IntegrationInstallation;

        /**
         * Token to use for API authentication.
         * This token has a short expiration time.
         */
        authToken: string;

        /**
         * API endpoint to use to connect to GitBook.
         */
        apiEndpoint: string;

        /**
         * Environment variables defined at the integration level.
         */
        env: Record<string, string>;
    }

    export const environment: GitBookEnvironment;
}

export {};
