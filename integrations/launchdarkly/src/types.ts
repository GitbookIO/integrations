import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type LaunchDarklySiteInstallationConfiguration = {
    project_key?: string;
    service_token?: string;
    lastSync?: number;
};

export type LaunchDarklyRuntimeEnvironment = RuntimeEnvironment<
    {},
    LaunchDarklySiteInstallationConfiguration
>;

export type LaunchDarklyRuntimeContext = RuntimeContext<LaunchDarklyRuntimeEnvironment>;

export type LaunchDarklyState = LaunchDarklySiteInstallationConfiguration;

export type LaunchDarklyProps = {
    siteInstallation: {
        configuration?: LaunchDarklySiteInstallationConfiguration;
    };
};
export type LaunchDarklyAction = { action: 'save.config' };

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
