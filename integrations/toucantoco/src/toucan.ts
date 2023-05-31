/**
 * Extract the Toucan ID and subdomain from the embed URL.
 */
export function extractToucanInfoFromURL(input: string): {
    toucanId?: string;
} {
    const url = new URL(input);

    // Ignore non-TT URLs
    if (!url.hostname.endsWith('.toucantoco.com')) {
        return;
    }

    return { toucanId: url.searchParams.get('id') };
}
