import { Router } from 'itty-router';

import { RequestUpdateIntegrationInstallation } from '@gitbook/api';
import {
    createIntegration,
    createComponent,
    FetchEventCallback,
} from '@gitbook/runtime';

import { AppaRuntimeContext, AppaInstallationConfiguration } from './types';
import {
    exchangeAuthCode,
    provisionMcpServer,
    syncSpace,
    getServerStatus,
    verifyWebhookSignature,
} from './appa';

const APPA_DASHBOARD_URL = 'https://appatools.com/mcp-studio/dashboard';

const statusBlock = createComponent<
    Record<string, never>,
    { loading: boolean; status: string; sources: number; totalCalls: number; endpoint: string },
    { action: 'refresh' },
    AppaRuntimeContext
>({
    componentId: 'appa-status',
    initialState: {
        loading: true,
        status: 'unknown',
        sources: 0,
        totalCalls: 0,
        endpoint: '',
    },
    async action(element, action, context) {
        if (action.action === 'refresh') {
            const config = context.environment.installation
                ?.configuration as AppaInstallationConfiguration;
            const creds = config?.appa_credentials;

            if (!creds?.server_id || !creds?.api_key) {
                return {
                    state: {
                        loading: false,
                        status: 'not_connected',
                        sources: 0,
                        totalCalls: 0,
                        endpoint: '',
                    },
                };
            }

            const serverStatus = await getServerStatus(creds.server_id, creds.api_key);

            return {
                state: {
                    loading: false,
                    status: serverStatus?.status || 'unknown',
                    sources: serverStatus?.sources || 0,
                    totalCalls: serverStatus?.totalCalls || 0,
                    endpoint: creds.mcp_endpoint || '',
                },
            };
        }

        return element;
    },
    async render(element, context) {
        const config = context.environment.installation
            ?.configuration as AppaInstallationConfiguration;
        const creds = config?.appa_credentials;

        if (!creds?.mcp_endpoint) {
            return (
                <block>
                    <card title="Appa MCP Enhancer">
                        <box>
                            <text>
                                Connect your Appa account to get started. Click the "Connect Appa"
                                button in the integration settings.
                            </text>
                        </box>
                    </card>
                </block>
            );
        }

        return (
            <block>
                <card
                    title="Appa Enhanced MCP"
                    onPress={{ action: '@ui.url.open', url: APPA_DASHBOARD_URL }}
                >
                    <box>
                        <text>
                            {`Status: ${element.state.status} | Sources: ${element.state.sources} | Calls: ${element.state.totalCalls}`}
                        </text>
                        <text>{`Endpoint: ${creds.mcp_endpoint}`}</text>
                    </box>
                </card>
                <button label="Refresh" onPress={{ action: 'refresh' }} />
            </block>
        );
    },
});

const handleFetchEvent: FetchEventCallback<AppaRuntimeContext> = async (request, context) => {
    const { environment } = context;

    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint
        ).pathname,
    });

    router.get('/connect', async () => {
        const appUrl = `https://appatools.com/mcp-studio/auth/signin?callbackUrl=${encodeURIComponent(
            `${environment.integration.urls.publicEndpoint}/callback`
        )}&gitbook_install=${environment.installation?.id || ''}`;

        return Response.redirect(appUrl, 302);
    });

    router.get('/callback', async (req) => {
        const url = new URL(req.url);
        const code = url.searchParams.get('code');

        if (!code) {
            return new Response('Missing authorization code. Please try again.', {
                status: 400,
            });
        }

        const clientSecret = environment.secrets?.APPA_CLIENT_SECRET;
        if (!clientSecret) {
            return new Response('Integration misconfigured: missing client secret.', {
                status: 500,
            });
        }

        const credentials = await exchangeAuthCode(code, clientSecret);
        if (!credentials) {
            return new Response(
                'Failed to exchange authorization code. The code may have expired — please try again.',
                { status: 400 }
            );
        }

        const { api_key: apiKey, user_id: userId } = credentials;

        const spaceId =
            environment.spaceInstallation?.space || environment.installation?.id || '';
        const spaceUrl =
            environment.spaceInstallation?.urls?.publicEndpoint ||
            environment.integration.urls.publicEndpoint;

        const provision = await provisionMcpServer(
            {
                gitbookSpaceId: spaceId,
                gitbookSpaceUrl: spaceUrl,
                gitbookSpaceTitle: environment.integration.name || 'GitBook Space',
                installationId: environment.installation?.id || '',
            },
            apiKey
        );

        if (!provision) {
            return new Response(
                'Failed to provision MCP server. Please check your Appa account and try again.',
                { status: 500 }
            );
        }

        const configUpdate: RequestUpdateIntegrationInstallation = {
            configuration: {
                appa_credentials: {
                    api_key: apiKey,
                    user_id: userId,
                    server_id: provision.serverId,
                    mcp_endpoint: provision.sseEndpoint,
                },
            },
        };

        if (environment.installation?.id) {
            await context.api.integrations.updateIntegrationInstallation(
                environment.integration.name,
                environment.installation.id,
                configUpdate
            );
        }

        return new Response(buildSuccessPage(provision.sseEndpoint, provision.serverId), {
            headers: { 'Content-Type': 'text/html' },
        });
    });

    router.get('/status', async () => {
        const config = environment.installation
            ?.configuration as AppaInstallationConfiguration;
        const creds = config?.appa_credentials;

        if (!creds?.server_id || !creds?.api_key) {
            return new Response(JSON.stringify({ connected: false }), {
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const status = await getServerStatus(creds.server_id, creds.api_key);
        return new Response(
            JSON.stringify({
                connected: true,
                endpoint: creds.mcp_endpoint,
                ...status,
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    });

    router.post('/webhook', async (req) => {
        const clientSecret = environment.secrets?.APPA_CLIENT_SECRET;
        if (!clientSecret) {
            return new Response('Webhook secret not configured', { status: 500 });
        }

        const rawBody = await req.text?.() ?? '';
        const signature = req.headers.get('x-appa-signature') ?? '';

        const valid = await verifyWebhookSignature(rawBody, signature, clientSecret);
        if (!valid) {
            return new Response('Invalid signature', { status: 401 });
        }

        const config = environment.installation
            ?.configuration as AppaInstallationConfiguration;
        const creds = config?.appa_credentials;

        if (!creds?.server_id || !creds?.api_key) {
            return new Response('Not connected', { status: 400 });
        }

        let body: { event?: string } | undefined;
        try {
            body = JSON.parse(rawBody);
        } catch {
            return new Response('Invalid JSON', { status: 400 });
        }

        if (body?.event === 'content_updated') {
            const spaceUrl =
                environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.integration.urls.publicEndpoint;

            await syncSpace(creds.server_id, spaceUrl, creds.api_key);
        }

        return new Response('ok');
    });

    const response = await router.handle(request, context);
    if (!response) {
        return new Response(`No route matching ${request.method} ${request.url}`, {
            status: 404,
        });
    }

    return response;
};

const handleSpaceContentUpdated = async (
    event: { spaceId: string },
    context: AppaRuntimeContext
) => {
    const config = context.environment.installation
        ?.configuration as AppaInstallationConfiguration;
    const creds = config?.appa_credentials;
    const autoSync =
        (context.environment.spaceInstallation?.configuration as { auto_sync?: boolean })
            ?.auto_sync ?? true;

    if (!creds?.server_id || !creds?.api_key || !autoSync) return;

    const spaceUrl =
        context.environment.spaceInstallation?.urls?.publicEndpoint ||
        context.environment.integration.urls.publicEndpoint;

    await syncSpace(creds.server_id, spaceUrl, creds.api_key);
};

function buildSuccessPage(endpoint: string, serverId: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Connected to Appa</title>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: linear-gradient(135deg, #f8f9fb 0%, #eef1f5 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }
        .card {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            max-width: 480px;
            width: 100%;
            padding: 40px 32px;
            text-align: center;
        }
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #ecfdf5;
            color: #059669;
            font-size: 13px;
            font-weight: 600;
            padding: 6px 14px;
            border-radius: 100px;
            margin-bottom: 20px;
        }
        .badge svg { flex-shrink: 0; }
        h1 {
            font-size: 22px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 8px;
        }
        .subtitle {
            color: #6b7280;
            font-size: 15px;
            line-height: 1.5;
            margin-bottom: 24px;
        }
        .endpoint-box {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 14px 16px;
            margin-bottom: 24px;
            text-align: left;
        }
        .endpoint-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #9ca3af;
            margin-bottom: 6px;
        }
        .endpoint-url {
            font-family: 'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 13px;
            color: #374151;
            word-break: break-all;
            line-height: 1.5;
        }
        .actions { display: flex; flex-direction: column; gap: 10px; }
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 20px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.15s ease;
            cursor: pointer;
            border: none;
        }
        .btn-primary {
            background: #4b5563;
            color: #fff;
        }
        .btn-primary:hover { background: #374151; }
        .btn-secondary {
            background: #f3f4f6;
            color: #374151;
        }
        .btn-secondary:hover { background: #e5e7eb; }
        .close-hint {
            color: #9ca3af;
            font-size: 13px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Connected
        </div>
        <h1>Your enhanced MCP is ready</h1>
        <p class="subtitle">
            GitBook content is being indexed. Add more sources like GitHub repos, websites, or other MCP endpoints in MCP Studio.
        </p>
        <div class="endpoint-box">
            <div class="endpoint-label">MCP Endpoint</div>
            <div class="endpoint-url">${endpoint}</div>
        </div>
        <div class="actions">
            <a href="${APPA_DASHBOARD_URL}/${serverId}" class="btn btn-primary" target="_blank">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Open MCP Studio
            </a>
            <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('${endpoint}');this.textContent='Copied!'">
                Copy endpoint URL
            </button>
        </div>
        <p class="close-hint">You can close this window and return to GitBook.</p>
    </div>
</body>
</html>`;
}

export default createIntegration<AppaRuntimeContext>({
    fetch: handleFetchEvent,
    components: [statusBlock],
    events: {
        space_content_updated: handleSpaceContentUpdated,
    },
});
