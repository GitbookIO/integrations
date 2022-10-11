import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

type GARuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            tracking_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: GARuntimeContext
) => {
    const trackingId = environment.spaceInstallation.configuration.tracking_id;
    if (!trackingId) {
        throw new Error(
            `The Google Analytics tracking ID is missing from the Space (ID: ${event.installationId}) installation.`
        );
    }

    return new Response(
        `
(function(w, d, s, l, i){
    w[l] = w[l] || [];
    w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
    });
    var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    j.onload = function() {
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        
        gtag('config', i, {
            send_page_view: false,
            anonymize_ip: true,
            groups: 'tracking_views',
        });
    };
    f.parentNode.insertBefore(j, f);
    
})(window, document, 'script', 'dataLayer', 'GTM-${trackingId}');
`,
        {
            headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'max-age=604800',
            },
        }
    );
};

export default createIntegration<GARuntimeContext>({
    events: {
        fetch_published_script: handleFetchEvent,
    },
});
