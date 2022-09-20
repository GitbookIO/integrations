import { RuntimeEnvironment, RuntimeContext } from "@gitbook/runtime";

export interface FigmaInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
    };
}

export type FigmaRuntimeEnvironment = RuntimeEnvironment<FigmaInstallationConfiguration>;
export type FigmaRuntimeContext = RuntimeContext<FigmaRuntimeEnvironment>;
