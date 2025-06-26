import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type BucketSiteInstallationConfiguration = {
    secret_key?: string;
    lastSyncAttemptAt?: number;
};

export type BucketRuntimeEnvironment = RuntimeEnvironment<{}, BucketSiteInstallationConfiguration>;

export type BucketRuntimeContext = RuntimeContext<BucketRuntimeEnvironment>;

export type BucketState = BucketSiteInstallationConfiguration;

export type BucketProps = {
    siteInstallation: {
        configuration?: BucketSiteInstallationConfiguration;
    };
};
export type BucketAction = { action: 'save.config' };
