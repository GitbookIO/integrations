/**
 * Check if a string is a valid HTTP URL
 */
export function checkIsHTTPURL(str: string): boolean {
    if (!str.startsWith('http')) {
        return false;
    }
    try {
        new URL(str);
        return true;
    } catch (e) {
        return false;
    }
}
