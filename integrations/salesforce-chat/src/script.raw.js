(function () {
    var ORG_ID = '<ORG_ID>';
    var MESSAGING_DEPLOYMENT_NAME = '<MESSAGING_DEPLOYMENT_NAME>';
    var EMBEDDED_SERVICE_SITE_URL = '<EMBEDDED_SERVICE_SITE_URL>';
    var SCRT2_URL = '<SCRT2_URL>';

    var w = window;
    var d = document;

    function loadScript(src, onload) {
        var s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = src;
        s.onload = onload;
        var x = d.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
    }

    function initMessaging() {
        if (!w.embeddedservice_bootstrap) {
            return;
        }

        w.embeddedservice_bootstrap.settings.language = 'en_US';

        try {
            w.embeddedservice_bootstrap.init(
                ORG_ID,
                MESSAGING_DEPLOYMENT_NAME,
                EMBEDDED_SERVICE_SITE_URL,
                {
                    scrt2URL: SCRT2_URL,
                },
            );
        } catch (err) {
            // initialization failed
        }
    }

    function onMessagingLoaded() {
        if (!w.embeddedservice_bootstrap) {
            return;
        }
        initMessaging();
    }

    function bootstrap() {
        if (w.embeddedservice_bootstrap) {
            onMessagingLoaded();
            return;
        }

        loadScript(
            EMBEDDED_SERVICE_SITE_URL.replace(/\/$/, '') + '/assets/js/bootstrap.min.js',
            onMessagingLoaded,
        );

        if (w.GitBook) {
            w.GitBook.addEventListener('unload', function () {
                w.embeddedservice_bootstrap = undefined;
            });
        }
    }

    if (w.attachEvent) {
        w.attachEvent('onload', bootstrap);
    } else {
        w.addEventListener('load', bootstrap, false);
    }
})();
