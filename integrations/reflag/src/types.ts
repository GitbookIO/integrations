import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type ReflagSiteInstallationConfiguration = {
    secret_key?: string;
    lastSyncAttemptAt?: number;
};

export type ReflagRuntimeEnvironment = RuntimeEnvironment<{}, ReflagSiteInstallationConfiguration>;

export type ReflagRuntimeContext = RuntimeContext<ReflagRuntimeEnvironment>;

export type ReflagState = ReflagSiteInstallationConfiguration;

export type ReflagProps = {
    siteInstallation: {
        configuration?: ReflagSiteInstallationConfiguration;
    };
};
export type ReflagAction = { action: 'save.config' };
