/**
 * Extract the Navattic demo ID from an embed/share URL.
 *
 * Demo links look like https://capture.navattic.com/<demo-id>
 */
export function extractNavatticDemoIdFromURL(input: string): { demoId?: string } {
    const url = new URL(input);
    if (url.hostname !== 'capture.navattic.com') {
        return {};
    }

    const parts = url.pathname.split('/').filter(Boolean);
    const demoId = parts[0];

    return demoId ? { demoId } : {};
}
