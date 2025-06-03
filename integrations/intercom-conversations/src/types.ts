import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export type IntercomInstallationConfiguration = {
    /**
     * OAuth credentials.
     */
    oauth_credentials?: {
        access_token: string;
    };
};

export type IntercomRuntimeEnvironment = RuntimeEnvironment<IntercomInstallationConfiguration>;
export type IntercomRuntimeContext = RuntimeContext<IntercomRuntimeEnvironment>;
