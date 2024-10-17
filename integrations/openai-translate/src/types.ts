import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export const DEFAULT_MODEL = 'gpt-4o';

export type OpenAITranslateConfiguration = {
    /**
     * API key for OpenAI.
     */
    apiKey?: string;

    /**
     * URL of the OpenAI API.
     */
    apiUrl?: string;

    /**
     * Model to use for translation.
     */
    model?: string;
};

export type OpenAITranslateRuntimeEnvironment = RuntimeEnvironment<
    OpenAITranslateConfiguration,
    {}
>;
export type OpenAITranslateRuntimeContext = RuntimeContext<OpenAITranslateRuntimeEnvironment>;
