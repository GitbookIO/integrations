import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export interface AppaInstallationConfiguration {
    appa_credentials?: {
        api_key: string;
        user_id: string;
        server_id: string;
        mcp_endpoint: string;
    };
}

export interface AppaSpaceConfiguration {
    mcp_endpoint?: string;
    auto_sync?: boolean;
}

export type AppaRuntimeEnvironment = RuntimeEnvironment<
    AppaInstallationConfiguration,
    AppaSpaceConfiguration
>;
export type AppaRuntimeContext = RuntimeContext<AppaRuntimeEnvironment>;
