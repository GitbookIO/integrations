import { IntegrationError, Logger, type RuntimeContext } from '@gitbook/runtime';

export const ARCADE_OEMBED_CACHE_MAX_AGE = 5 * 60;
const OEMBED_REQUEST_TIMEOUT = 10_000;
const logger = Logger('arcade');

interface ArcadeOEmbedDimensions {
    readonly width: number;
    readonly height: number;
}

/**
 * Fetch validated Arcade oEmbed dimensions.
 */
export async function fetchArcadeOEmbedData(
    flowId: string,
    context: Pick<RuntimeContext, 'waitUntil'>,
): Promise<ArcadeOEmbedDimensions> {
    const url = new URL('https://app.arcade.software/api/oembed');
    url.searchParams.append('url', `https://app.arcade.software/share/${flowId}`);
    const cacheKey = url.toString();

    let cache: Cache | undefined;
    try {
        // Untrusted dispatch namespaces isolate Cache API entries by Worker.
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
        if ([400, 404, 422].includes(response.status)) {
            throw new IntegrationError('invalid_input');
        }
        if (response.status === 401 || response.status === 403) {
            throw new IntegrationError('configuration_required');
        }

        throw new Error(`${response.status} ${response.statusText}`);
    }

    const dimensions = await readArcadeOEmbed(response);
    if (cache) {
        context.waitUntil(
            cache
                .put(
                    cacheKey,
                    Response.json(dimensions, {
                        headers: { 'Cache-Control': `max-age=${ARCADE_OEMBED_CACHE_MAX_AGE}` },
                    }),
                )
                .catch(() => logger.error('Failed to write oEmbed cache')),
        );
    }

    return dimensions;
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

async function readArcadeOEmbed(response: Response): Promise<ArcadeOEmbedDimensions> {
    const result = await response.json<{ width?: unknown; height?: unknown } | null>();
    const width = result?.width;
    const height = result?.height;
    if (
        typeof width !== 'number' ||
        !Number.isFinite(width) ||
        width <= 0 ||
        typeof height !== 'number' ||
        !Number.isFinite(height) ||
        height <= 0 ||
        !Number.isFinite(width / height)
    ) {
        throw new Error('Invalid Arcade oEmbed dimensions');
    }
    return { width, height };
}
