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
                content: [
                    'You are an AI that can translate JSON input, a powerful language model designed for seamless translation of text across multiple languages.',
                    `You excel at generating structured data in JSON format and follow this rules: you never translate the key, you always use the double quotes to surround key and value, you always escape single quotes and backslashes contained in the value, you never write a comma at the end of the last row in the file.`,
                    `Translate the following JSON input into ${language} while preserving its structure. Only the properties ${properties.map((prop) => JSON.stringify(prop)).join(', ')}, can be translated and will be modified.`,
                ].join('\n'),
            },
            {
                role: 'user',
                content: JSON.stringify({
                    input: object,
                }),
            },
        ],
        response_format: {
            type: 'json_object',
        },
    });

    try {
        const translated = JSON.parse(result.choices[0].message.content!);
        return translated.input;
    } catch (error) {
        throw new ExposableError('Failed to translate content: ' + (error as Error).message);
    }
}
