const APPA_API_BASE = 'https://appatools.com/mcp-studio/api';

interface AppaProvisionResponse {
    serverId: string;
    slug: string;
    mcpEndpoint: string;
    sseEndpoint: string;
}

interface AppaProvisionRequest {
    gitbookSpaceId: string;
    gitbookSpaceUrl: string;
    gitbookSpaceTitle: string;
    installationId: string;
}

interface AppaTokenExchangeResponse {
    api_key: string;
    user_id: string;
}

/**
 * Exchange a short-lived authorization code for API credentials.
 * The code is single-use and expires quickly, so the actual api_key
 * never travels through URL parameters or browser history.
 */
export async function exchangeAuthCode(
    code: string,
    clientSecret: string
): Promise<AppaTokenExchangeResponse | null> {
    try {
        const res = await fetch(`${APPA_API_BASE}/integrations/gitbook/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${clientSecret}`,
            },
            body: JSON.stringify({ code }),
            signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) return null;
        return (await res.json()) as AppaTokenExchangeResponse;
    } catch {
        return null;
    }
}

export async function provisionMcpServer(
    params: AppaProvisionRequest,
    apiKey: string
): Promise<AppaProvisionResponse | null> {
    try {
        const res = await fetch(`${APPA_API_BASE}/integrations/gitbook/provision`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(params),
            signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) return null;
        return (await res.json()) as AppaProvisionResponse;
    } catch {
        return null;
    }
}

export async function syncSpace(
    serverId: string,
    spaceUrl: string,
    apiKey: string
): Promise<boolean> {
    try {
        const res = await fetch(`${APPA_API_BASE}/integrations/gitbook/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ serverId, spaceUrl }),
            signal: AbortSignal.timeout(10000),
        });
        return res.ok;
    } catch {
        return false;
    }
}

export async function getServerStatus(
    serverId: string,
    apiKey: string
): Promise<{ status: string; sources: number; totalCalls: number } | null> {
    try {
        const res = await fetch(`${APPA_API_BASE}/integrations/gitbook/status/${serverId}`, {
            headers: { Authorization: `Bearer ${apiKey}` },
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

/**
 * Verify an incoming webhook signature using HMAC-SHA256.
 * Returns true only when the header matches the expected digest.
 */
export async function verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
): Promise<boolean> {
    try {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
        const expected = Array.from(new Uint8Array(sig))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
        return signature === `sha256=${expected}`;
    } catch {
        return false;
    }
}
