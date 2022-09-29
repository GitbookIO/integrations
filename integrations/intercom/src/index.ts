import {
    createIntegration,
    FetchEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

type IntercomRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            app_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchEventCallback = async (
    event,
    { environment }: IntercomRuntimeContext
) => {
    const appId = environment.spaceInstallation.configuration.app_id;
    if (!appId) {
        throw new Error(
            `The Intercom application ID is missing from the Space (ID: ${event.installationId}) installation.`
        );
    }

    return new Response(
        `
var APP_ID = "${appId}";

(function(){
    var w = window;
    var ic = w.Intercom;
    if (typeof ic === "function") {
        ic('reattach_activator');
        ic('update',w.intercomSettings);
    } else {
        var d = document;
        var i = function(){i.c(arguments);};
        i.q = [];
        i.c = function(args){i.q.push(args);};
        w.Intercom = i;
        var l = function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/' + APP_ID;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);};
        if (document.readyState==='complete') {
            l();
        } else if (w.attachEvent) {
            w.attachEvent('onload',l);
        } else {
            w.addEventListener('load',l,false);
        }
    }
})();
            

`,
        {
            headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'max-age=604800',
            },
        }
    );
};

export default createIntegration<IntercomRuntimeContext>({
    events: {
        fetch_published_script: handleFetchEvent,
    },
});
