import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type AiTranslateConfiguration = {};

export type AiTranslateRuntimeEnvironment = RuntimeEnvironment<AiTranslateConfiguration, {}>;
export type AiTranslateRuntimeContext = RuntimeContext<AiTranslateRuntimeEnvironment>;
