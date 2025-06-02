import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export type ZendeskInstallationConfiguration = {
    /**
     * Zendesk subdomain.
     */
    subdomain?: string;

    /**
     * OAuth credentials.
     */
    oauth_credentials?: {
        access_token: string;
    };
};

export type ZendeskRuntimeEnvironment = RuntimeEnvironment<ZendeskInstallationConfiguration>;
export type ZendeskRuntimeContext = RuntimeContext<ZendeskRuntimeEnvironment>;
