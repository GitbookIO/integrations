import { ExposableError, Logger } from '@gitbook/runtime';
import { FirefliesRuntimeContext } from './types';

const logger = Logger('fireflies-conversations:client');

/**
 * Get the API key for Fireflies API calls.
 */
export function getFirefliesApiKey(context: FirefliesRuntimeContext): string {
    const { installation } = context.environment;

    if (!installation) {
        throw new ExposableError('Installation not found');
    }

    const { api_key } = installation.configuration;
    if (!api_key) {
        throw new ExposableError(
            'Fireflies API key not found. Please configure the API key in the integration settings.',
        );
    }

    return api_key;
}

/**
 * Make a GraphQL request to the Fireflies API.
 */
export async function firefliesGraphQLRequest<T = unknown>(
    context: FirefliesRuntimeContext,
    query: string,
    variables?: Record<string, unknown>,
): Promise<T> {
    const apiKey = getFirefliesApiKey(context);

    const response = await fetch('https://api.fireflies.ai/graphql', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        logger.error('Fireflies API request failed', {
            status: response.status,
            statusText: response.statusText,
            error: errorText,
        });
        throw new Error(`Fireflies API request failed: ${response.status} ${response.statusText}`);
    }

    const result = (await response.json()) as T;

    // Check for GraphQL errors
    if (result && typeof result === 'object' && 'errors' in result) {
        const errors = (result as { errors?: Array<{ message: string }> }).errors;
        if (errors && errors.length > 0) {
            const errorMessage = errors.map((e) => e.message).join(', ');
            logger.error('Fireflies GraphQL errors', { errors });
            throw new Error(`Fireflies GraphQL error: ${errorMessage}`);
        }
    }

    return result;
}
