/**
 * Get the integration content URL for rendering WebFrames and other content.
 * This uses the separate cookie-less origin when configured.
 *
 * @param urls - The URLs object from installation or integration
 * @param path - The path to append (e.g., '/webframe', '/webhook')
 * @returns The full URL for the content endpoint
 */
export function getIntegrationContentURL(
    urls: {
        publicContentEndpoint: string;
    },
    path: string,
): string {
    const endpoint = urls.publicContentEndpoint.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${endpoint}${normalizedPath}`;
}

/**
 * Get the integration public URL for OAuth and authentication flows.
 * These must use the publicEndpoint with cookies.
 *
 * @param urls - The URLs object from installation or integration
 * @param path - The path to append (e.g., '/oauth', '/visitor-auth/response')
 * @returns The full URL for the public endpoint
 */
export function getIntegrationPublicURL(
    urls: {
        publicEndpoint: string;
    },
    path: string,
): string {
    const endpoint = urls.publicEndpoint.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${endpoint}${normalizedPath}`;
}
