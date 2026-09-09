(function () {
    var w = window;
    var d = document;

    var NON_ESSENTIAL_CATEGORIES = ['ANALYTICS', 'MARKETING', 'PERSONALIZATION', 'STORAGE'];

    // Registers the window.Osano('eventName', callback) pre-load queue so listeners
    // added before osano.js has loaded are replayed once the real API is ready.
    // See https://developers.osano.com/cmp/javascript-api/developer-documentation-consent-javascript-api#pre-load
    function setupOsanoPreload() {
        if (typeof w.Osano === 'function') return;
        w.Osano = function () {
            w.Osano.data.push(arguments);
        };
        w.Osano.data = [];
    }

    function injectOsano() {
        var stub = d.getElementById('osano-sdk-stub');
        if (stub) return;

        var s = d.createElement('script');
        s.id = 'osano-sdk-stub';
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://cmp.osano.com/<CUSTOMER_ID>/<CONFIG_ID>/osano.js';
        d.head.appendChild(s);
    }

    function l() {
        if (!w.GitBook || typeof w.GitBook.registerCookieBanner !== 'function') return;

        w.GitBook.registerCookieBanner(function ({ onApprove, onReject }) {
            setupOsanoPreload();

            var CONSENT_STORAGE_KEY = 'osano-gitbook-last-consent-decision';
            var initialized = false;

            function emitConsent(consent) {
                // Consent saved before Osano is initialized is Osano's own, not the visitor's.
                if (!initialized) return;

                try {
                    var hasNonEssential =
                        !!consent &&
                        NON_ESSENTIAL_CATEGORIES.some(function (category) {
                            return consent[category] === 'ACCEPT';
                        });
                    var decision = hasNonEssential ? 'approve' : 'reject';

                    // onApprove/onReject reload the page, so skip decisions GitBook already holds.
                    if (w.GitBook.isCookiesTrackingDisabled() === !hasNonEssential) return;
                    if (w.sessionStorage.getItem(CONSENT_STORAGE_KEY) === decision) return;
                    w.sessionStorage.setItem(CONSENT_STORAGE_KEY, decision);

                    if (hasNonEssential) {
                        onApprove();
                    } else {
                        onReject();
                    }
                } catch (e) {
                    onReject();
                }
            }

            w.Osano('onInitialized', function () {
                initialized = true;
            });
            w.Osano('onConsentSaved', emitConsent);

            injectOsano();
        });
    }

    if (w.attachEvent) {
        w.attachEvent('onload', l);
    } else {
        w.addEventListener('load', l, false);
    }
})();
