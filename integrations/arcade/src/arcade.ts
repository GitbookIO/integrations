import { IntegrationError } from '@gitbook/runtime';

export const ARCADE_OEMBED_CACHE_MAX_AGE = 5 * 60;
const OEMBED_REQUEST_TIMEOUT = 10_000;
const MAX_OEMBED_CACHE_ENTRIES = 256;
const MAX_CACHED_FLOW_ID_LENGTH = 256;

interface ArcadeOEmbedDimensions {
    readonly width: number;
    readonly height: number;
}

// Isolate-local memory keeps the dimensions private in either namespace mode.
const oEmbedCache = new Map<string, { dimensions: ArcadeOEmbedDimensions; expiresAt: number }>();

/**
 * Fetch validated Arcade oEmbed dimensions.
 */
export async function fetchArcadeOEmbedData(flowId: string): Promise<ArcadeOEmbedDimensions> {
    const cached = oEmbedCache.get(flowId);
    if (cached) {
        oEmbedCache.delete(flowId);
        if (cached.expiresAt > Date.now()) {
            oEmbedCache.set(flowId, cached);
            return cached.dimensions;
        }
    }

    const url = new URL('https://app.arcade.software/api/oembed');
    url.searchParams.append('url', `https://app.arcade.software/share/${flowId}`);
    const response = await fetch(url.toString(), {
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
    if (typeof flowId === 'string' && flowId.length <= MAX_CACHED_FLOW_ID_LENGTH) {
        oEmbedCache.delete(flowId);
        oEmbedCache.set(flowId, {
            dimensions,
            expiresAt: Date.now() + ARCADE_OEMBED_CACHE_MAX_AGE * 1000,
        });

        if (oEmbedCache.size > MAX_OEMBED_CACHE_ENTRIES) {
            const oldestFlowId = oEmbedCache.keys().next().value;
            if (oldestFlowId !== undefined) {
                oEmbedCache.delete(oldestFlowId);
            }
        }
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
