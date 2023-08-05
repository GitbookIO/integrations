import { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export interface TerraformInstallationConfiguration {
    tokenSecret: string;
}

export type TerraformRuntimeEnvironment = RuntimeEnvironment<TerraformInstallationConfiguration>;

export type TerraformRuntimeContext = RuntimeContext<TerraformRuntimeEnvironment>;
