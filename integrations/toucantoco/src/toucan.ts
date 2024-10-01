/**
 * Extract the Toucan ID and subdomain from the embed URL.
 */
export function extractToucanInfoFromURL(input: string): undefined | {
    toucanId?: string;
} {
    const url = new URL(input);

    // Ignore non-TT URLs
    const toucanId = url.searchParams.get('id')
    if (!toucanId || !url.hostname.endsWith('.toucantoco.com')) {
        return;
    }

    return { toucanId };
}
