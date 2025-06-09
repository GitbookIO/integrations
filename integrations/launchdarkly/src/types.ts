import type { RuntimeContext } from '@gitbook/runtime';

export type IntegrationContext = {} & RuntimeContext;

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
