import { version } from '../package.json';

const MAX_AGE = 7 * 24 * 3600;
const STALE_IF_ERROR = 24 * 3600;
const CACHE_STALE_WHILE_REVALIDATE = STALE_IF_ERROR;

/**
 * Returns the response cache-control directives for the webframe request handler.
 */
export function getWebframeCacheControl(): string {
    const directives = [
        'public',
        `max-age=${MAX_AGE}`,
        `stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
        `stale-if-error=${STALE_IF_ERROR}`,
    ];
    return directives.join(', ');
}

/**
 * Returns the cache key that controls the webframe handler response caching.
 */
export function getWebframeCacheKey(): string {
    return version;
}
