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
