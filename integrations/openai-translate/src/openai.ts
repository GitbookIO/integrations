import { OpenAI } from 'openai';
import { ExposableError } from '@gitbook/runtime';
import { OpenAITranslateRuntimeContext } from './types';
import { deepExtract, deepMerge } from './utils';

/**
 * Get the OpenAI client associated with the current runtime context.
 */
export function getOpenAI(ctx: OpenAITranslateRuntimeContext): OpenAI {
    const apiKey = ctx.environment.installation?.configuration.apiKey;
    if (!apiKey) {
        throw new ExposableError('OpenAI API key is missing');
    }
    return new OpenAI({
        apiKey,
        baseURL: 'https://gateway.ai.cloudflare.com/v1/4401d86825a13bf607936cc3a9f3897a/integrations/openai' // ctx.environment.installation?.configuration.apiUrl,
    });
}

const languageNames: Record<string, string> = {
    en: 'English',
    it: 'Italian',
    fr: 'French',
    es: 'Spanish',
    de: 'German',
    pt: 'Portuguese',
    ru: 'Russian',
    ja: 'Japanese',
    ko: 'Korean',
};

/**
 * Translate a JSON object using OpenAI, by indicating the properties that can be translated.
 */
export async function translateJSON<T extends object>(
    ctx: OpenAITranslateRuntimeContext,
    language: string,
    object: T,
    properties: string[],
): Promise<T> {
    // To optimize AI performances, we want to pass a minimal JSON structure to it.
    const partial = deepExtract(object, (input) => {
        return properties.reduce(
            (acc, prop) => {
                if (prop in input && typeof input[prop] === 'string' && input[prop].length > 0) {
                    acc[prop] = input[prop];
                }
                return acc;
            },
            {} as { [key: string]: string },
        );
    });

    const openai = getOpenAI(ctx);
    const result = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // ctx.environment.installation?.configuration.model ??
        messages: [
            {
                role: 'system',
                content: [
                    'You are an AI that can translate JSON input, a powerful language model designed for seamless translation of text across multiple languages.',
                    `You excel at generating structured data in JSON format and follow this rules: you never translate the key, you always use the double quotes to surround key and value, you always escape single quotes and backslashes contained in the value, you never write a comma at the end of the last row in the file.`,
                    `Translate the following JSON input into ${languageNames[language] ?? language} while preserving its structure. Only the properties ${properties.map((prop) => JSON.stringify(prop)).join(', ')} can be translated and will be modified.`,
                ].join('\n'),
            },
            {
                role: 'user',
                content: JSON.stringify(partial),
            },
        ],
        response_format: {
            type: 'json_object',
        },
    });

    try {
        const translated = JSON.parse(result.choices[0].message.content!);
        return deepMerge(object, translated);
    } catch (error) {
        throw new ExposableError('Failed to translate content: ' + (error as Error).message);
    }
}
