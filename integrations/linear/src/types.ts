import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export interface LinearInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
    };
}

export type LinearRuntimeEnvironment = RuntimeEnvironment<LinearInstallationConfiguration>;
export type LinearRuntimeContext = RuntimeContext<LinearRuntimeEnvironment>;
