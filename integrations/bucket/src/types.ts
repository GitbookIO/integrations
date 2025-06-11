import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type BucketSiteInstallationConfiguration = {
    secret_key?: string;
    lastSync?: number;
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

export type IntegrationTaskType = 'sync-adaptive-schema';

export type BaseIntegrationTask<Type extends IntegrationTaskType, Payload extends object> = {
    type: Type;
    payload: Payload;
};

export type IntegrationTaskSyncSiteAdaptiveSchema = BaseIntegrationTask<
    'sync-adaptive-schema',
    {
        siteId: string;
        installationId: string;
        organizationId: string;
    }
>;

export type IntegrationTask = IntegrationTaskSyncSiteAdaptiveSchema;
