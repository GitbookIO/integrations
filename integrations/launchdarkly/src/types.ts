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
