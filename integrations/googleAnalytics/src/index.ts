import {
    createIntegration,
    FetchEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

type GARuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            tracking_id?: string;
            track_private_view?: boolean;
        }
    >
>;

export const handleFetchEvent: FetchEventCallback = async (
    event,
    { environment }: GARuntimeContext
) => {
    const trackingId = environment.spaceInstallation.configuration.tracking_id;
    if (!trackingId) {
        throw new Error(
            `The Google Analytics tracking ID is missing from the Space (ID: ${event.installationId}) installation.`
        );
    }

    const gtagScript = await fetch(
        `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
    ).then((result) => result.text());

    return new Response(
        `
${gtagScript}

function() {
    if (!window.gtag) {
        return;
    }
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    
    gtag('config', '${trackingId}', {
        send_page_view: false,
        anonymize_ip: true,
        groups: 'tracking_views',
    });
}();
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
    fetch: handleFetchEvent,
});
