import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export interface IntercomInstallationConfiguration {
    /**
     * ID of the team to ingest conversations from.
     */
    teamId: string;

    /**
     * OAuth credentials.
     */
    oauth_credentials?: {
        access_token: string;
    };
}

export type IntercomRuntimeEnvironment = RuntimeEnvironment<IntercomInstallationConfiguration>;
export type IntercomRuntimeContext = RuntimeContext<IntercomRuntimeEnvironment>; 