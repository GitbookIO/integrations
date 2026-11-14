import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type LaunchDarklySiteInstallationConfiguration = {
    project_key?: string;
    service_token?: string;
    lastSyncAttemptAt?: number;
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

export type LaunchDarklyFeatureFlag = {
    name: string;
    key: string;
    kind: 'boolean' | 'multivariate';
    _version: number;
    creationDate: number;
    variations: Array<{
        value: unknown;
        description?: string;
        name?: string;
        _id?: string;
    }>;
};

export type LaunchDarklyFeatureFlagsResponse = {
    items: Array<LaunchDarklyFeatureFlag>;
    totalCount?: number;
};
