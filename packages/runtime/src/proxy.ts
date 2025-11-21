import { IntegrationEnvironment } from "@gitbook/api";

const isUsingProxy = (env: IntegrationEnvironment) => {
    return env.proxied || false;
}

/**
 * Import a secret CryptoKey to use for signing.
 */
async function importKey(secret: string): Promise<CryptoKey> {
    return await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify'],
    );
}


/**
 * Convert an array buffer to a hex string
 */
export function arrayToHex(arr: ArrayBuffer) {
    return [...new Uint8Array(arr)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Sign a message with a secret key by using HMAC-SHA256 algorithm.
 */
async function signResponse(message: string, secret: string): Promise<string> {
    const key = await importKey(secret);
    const signed = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
    return arrayToHex(signed);
}


async function proxyRequest(url: string, init: RequestInit | undefined, env: IntegrationEnvironment): Promise<Response> {
    if(!env.secrets?.PROXY_URL || !env.secrets?.PROXY_SECRET) {
        throw new Error('Proxy is not properly configured for this integration.');
    }
    const signature = await signResponse(url, env.secrets.PROXY_SECRET);
    const proxyUrl = new URL(env.secrets.PROXY_URL);

    proxyUrl.searchParams.set('target', url);

    return fetch(proxyUrl.toString(), {
        ...init,
        headers: {
            ...init?.headers,
            'X-Gitbook-Proxy-Signature': signature,
        },
    });
}

export function fetchWithProxy(env: IntegrationEnvironment) {
    return async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
        if (isUsingProxy(env)) {
            const url = typeof input === 'string' ? input : input.url;
            return proxyRequest(url, init, env);
        } else {
            return fetch(input, init);
        }
    };
}

