import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type OpenAPIConfiguration = {};

export type OpenAPIRuntimeEnvironment = RuntimeEnvironment<OpenAPIConfiguration, {}>;
export type OpenAPIRuntimeContext = RuntimeContext<OpenAPIRuntimeEnvironment>;
