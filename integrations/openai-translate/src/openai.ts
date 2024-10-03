import { OpenAI } from 'openai';
import { OpenAITranslateRuntimeContext } from './types';
import { ExposableError } from '@gitbook/runtime';

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
        baseURL: ctx.environment.installation?.configuration.apiUrl,
    });
}

/**
 * Translate a JSON object using OpenAI, by indicating the properties that can be translated.
 */
export async function translateJSON<T>(
    ctx: OpenAITranslateRuntimeContext,
    language: string,
    object: T,
    properties: string[],
): Promise<T> {
    const openai = getOpenAI(ctx);
    const result = await openai.chat.completions.create({
        model: ctx.environment.installation?.configuration.model ?? 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: `Translate the following JSON object into ${language} while preserving its structure. Only the properties ${properties.map((prop) => JSON.stringify(prop)).join(', ')}, can be translated and will be modified.`,
            },
            {
                role: 'user',
                content: JSON.stringify(object),
            },
        ],
        response_format: {
            type: 'json_object',
        },
    });

    try {
        const translated = JSON.parse(result.choices[0].message.content!);
        return translated;
    } catch (error) {
        throw new ExposableError('Failed to translate content');
    }
}
