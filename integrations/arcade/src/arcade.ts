import { ExposableError, Logger, type RuntimeContext } from '@gitbook/runtime';

export const ARCADE_OEMBED_CACHE_MAX_AGE = 5 * 60;
const OEMBED_REQUEST_TIMEOUT = 10_000;
const logger = Logger('arcade');

export interface ArcadeOEmbed {
    type: 'rich';
    title: string;
    width: number;
    height: number;
}

/**
 * Fetch the Arcade oembed data.
 */
export async function fetchArcadeOEmbedData(
    flowId: string,
    context: Pick<RuntimeContext, 'waitUntil'>,
): Promise<ArcadeOEmbed> {
    const url = new URL(`https://app.arcade.software/api/oembed`);
    url.searchParams.append('url', `https://app.arcade.software/share/${flowId}`);

    const cacheKey = url.toString();
    let cache: Cache | undefined;
    try {
        cache = await caches.open('arcade-oembed');
        const cached = await cache.match(cacheKey);
        if (cached) {
            return await readArcadeOEmbed(cached);
        }
    } catch {
        logger.error('Failed to read oEmbed cache');
    }

    const response = await fetch(cacheKey, {
        signal: AbortSignal.timeout(OEMBED_REQUEST_TIMEOUT),
    });

    if (!response.ok) {
        if (response.status < 500) {
            throw new ExposableError(response.statusText, response.status);
        }

        throw new Error(`${response.status} ${response.statusText}`);
    }

    const result = await readArcadeOEmbed(response);

    if (cache) {
        context.waitUntil(
            cache
                .put(
                    cacheKey,
                    Response.json(result, {
                        headers: { 'Cache-Control': `max-age=${ARCADE_OEMBED_CACHE_MAX_AGE}` },
                    }),
                )
                .catch(() => logger.error('Failed to write oEmbed cache')),
        );
    }

    return result;
}

/**
 * Extract the Arcade flow ID and language from the embed URL.
 */
export function extractArcadeFlowFromURL(input: string): {
    flowId?: string;
    language?: string;
} {
    const url = new URL(input);
    if (!['app.arcade.software', 'demo.arcade.software'].includes(url.hostname)) {
        return {};
    }

    const parts = url.pathname.split('/');
    if (!['flows', 'share'].includes(parts[1])) {
        return {};
    }

    const language = url.searchParams.get('language') ?? undefined;
    return { flowId: parts[2], ...(language && { language }) };
}

async function readArcadeOEmbed(response: Response): Promise<ArcadeOEmbed> {
    const result = await response.json<ArcadeOEmbed>();
    if (
        !result ||
        !Number.isFinite(result.width) ||
        result.width <= 0 ||
        !Number.isFinite(result.height) ||
        result.height <= 0 ||
        !Number.isFinite(result.width / result.height)
    ) {
        throw new Error('Invalid Arcade oEmbed dimensions');
    }
    return result;
}
