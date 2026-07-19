/**
 * Extract the Toucan ID and subdomain from the embed URL.
 */
export function extractToucanInfoFromURL(input: string):
    | undefined
    | {
          toucanId?: string;
          height?: number;
          width?: number;
      } {
    const url = new URL(input);

    // Ignore non-TT URLs
    const toucanId = url.searchParams.get('id');
    let height = Number(url.searchParams.get('height')) || 100;
    let width = Number(url.searchParams.get('width')) || 100;

    if (!toucanId || !url.hostname.endsWith('.toucantoco.com')) {
        return;
    }

    return { toucanId, height, width };
}
