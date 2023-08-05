/**
 * Creates a cryptographically secure secret of 32 bytes (recommended for
 * HMAC-SHA256), returned as a base64 encoded string.
 */
export async function generateJwtSecret() {
    const data = new Uint8Array(32);
    crypto.getRandomValues(data);

    let binaryString = '';
    for (let i = 0; i < data.length; ++i) {
        binaryString += String.fromCharCode(data[i]!);
    }

    return btoa(binaryString);
}

/**
 * Parses a base64 encoded token secret into an `Uint8Array`.
 */
export function parseJwtSecret(encoded: string): Uint8Array {
    const decoded = btoa(encoded);
    const buf = new Uint8Array(decoded.length);
    for (let i = 0; i < buf.length; i++) {
        buf[i] = decoded.charCodeAt(i);
    }
    return buf;
}
