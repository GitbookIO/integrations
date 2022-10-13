import {
    createIntegration,
    FetchPublishScriptEventCallback,
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

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
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

window.intercomSettings = {
    app_id: APP_ID
};

(function () {
    const w = window;
    const ic = w.Intercom;
    if (typeof ic === 'function') {
        ic('reattach_activator');
        ic('update', w.intercomSettings);
    } else {
        const d = document;
        const i = function() {
            i.c(arguments);
        };
        i.q = [];
        i.c = function (args) {
            i.q.push(args);
        };
        w.Intercom = i;
        const l = function () {
            const s = d.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = 'https://widget.intercom.io/widget/${appId}';
            s.onload = () => {
                ic('boot', {
                    app_id: APP_ID,
                });
            };

            const x = d.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);

            w.GitBook.addEventListener('unload', () => {
                if (!ic) {
                    return;
                }

                ic('shutdown');
                w.Intercom = undefined;
            });
        };
        if (document.readyState === 'complete') {
            l();
        } else if (w.attachEvent) {
            w.attachEvent('onload', l);
        } else {
            w.addEventListener('load', l, false);
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
