import { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export interface StatuspageInstallationConfiguration {}

export interface StatuspageSpaceInstallationConfiguration {
    api_key?: string;
    page_id?: string;
}

export type StatuspageRuntimeEnvironment = RuntimeEnvironment<
    StatuspageInstallationConfiguration,
    StatuspageSpaceInstallationConfiguration
>;

export type StatuspageRuntimeContext = RuntimeContext<StatuspageRuntimeEnvironment>;
