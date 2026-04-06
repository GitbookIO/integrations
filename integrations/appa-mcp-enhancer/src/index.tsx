import { Router } from 'itty-router';

import { RequestUpdateIntegrationInstallation } from '@gitbook/api';
import {
    createIntegration,
    createComponent,
    FetchEventCallback,
} from '@gitbook/runtime';

import { AppaRuntimeContext, AppaInstallationConfiguration } from './types';
import { provisionMcpServer, syncSpace, getServerStatus } from './appa';

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
        const apiKey = url.searchParams.get('api_key');
        const userId = url.searchParams.get('user_id');

        if (!apiKey || !userId) {
            return new Response('Missing credentials from Appa. Please try again.', {
                status: 400,
            });
        }

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

        const successHtml = `
<!DOCTYPE html>
<html>
<head><title>Connected to Appa</title></head>
<body style="font-family:system-ui;max-width:480px;margin:80px auto;text-align:center">
    <h1>Connected!</h1>
    <p>Your enhanced MCP endpoint is ready:</p>
    <code style="display:block;padding:12px;background:#f4f4f5;border-radius:8px;word-break:break-all;margin:16px 0">
        ${provision.sseEndpoint}
    </code>
    <p>Add more sources in <a href="${APPA_DASHBOARD_URL}/${provision.serverId}">MCP Studio</a>.</p>
    <p style="color:#888;font-size:14px;margin-top:24px">You can close this window.</p>
</body>
</html>`;

        return new Response(successHtml, {
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
        const config = environment.installation
            ?.configuration as AppaInstallationConfiguration;
        const creds = config?.appa_credentials;

        if (!creds?.server_id || !creds?.api_key) {
            return new Response('Not connected', { status: 400 });
        }

        const body = await req.json?.();

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

export default createIntegration<AppaRuntimeContext>({
    fetch: handleFetchEvent,
    components: [statusBlock],
    events: {
        space_content_updated: handleSpaceContentUpdated,
    },
});
