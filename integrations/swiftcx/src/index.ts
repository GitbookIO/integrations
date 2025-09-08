import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

type SwiftCXRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            customer_id?: string;
            agent_id?: string;
            access_token?: string;
            origin?: string;
            environment?: 'production' | 'development';
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: SwiftCXRuntimeContext,
) => {
    const config = environment.siteInstallation?.configuration || {};
    const customerId = config.customer_id;
    const agentId = config.agent_id;
    const accessToken = config.access_token;
    const origin = config.origin;
    const env = config.environment || 'production';

    if (!customerId || !agentId || !accessToken || !origin) {
        throw new Error(
            `SwiftCX configuration is incomplete (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }). Required: customer_id, agent_id, access_token, origin.`,
        );
    }

    const scriptUrl =
        env === 'production'
            ? 'https://chatwidget.swiftcx.com/src/embed/index.js'
            : 'https://dev.chatwidget.swiftcx.com/src/embed/index.js';

    const script = `
        (function() {
            if (document.getElementById('scxChatWidget')) return;
            var s = document.createElement('script');
            s.id = 'scxChatWidget';
            s.type = 'module';
            s.async = true;
            s.crossOrigin = 'anonymous';
            s.setAttribute('data-customer-id', ${JSON.stringify(customerId)});
            s.setAttribute('data-agent-id', ${JSON.stringify(agentId)});
            s.setAttribute('data-access-token', ${JSON.stringify(accessToken)});
            s.setAttribute('data-origin', ${JSON.stringify(origin)});
            s.src = ${JSON.stringify(scriptUrl)};
            s.onerror = function(){ console.error('Failed to load SwiftCX ChatWidget'); };
            s.onload = function(){ console.log('SwiftCX ChatWidget loaded'); };
            document.head.appendChild(s);
        })();
    `;

    return new Response(script, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=86400',
        },
    });
};

export default createIntegration<SwiftCXRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});


