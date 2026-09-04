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
            var visitorActed = false;
            var pendingDecision = null;

            function decisionFor(consent) {
                var hasNonEssential =
                    !!consent &&
                    NON_ESSENTIAL_CATEGORIES.some(function (category) {
                        return consent[category] === 'ACCEPT';
                    });
                return hasNonEssential ? 'approve' : 'reject';
            }

            function forward(decision) {
                try {
                    // onConsentSaved replays the visitor's existing decision on every
                    // page load, not just when it changes. GitBook's onApprove/onReject
                    // can trigger a reload to reinitialize scripts, so forwarding every
                    // replay would reload -> replay -> reload forever. Only forward the
                    // decision when it's actually different from last time, and persist
                    // that in sessionStorage since it must survive the reload.
                    if (w.sessionStorage.getItem(CONSENT_STORAGE_KEY) === decision) return;
                    w.sessionStorage.setItem(CONSENT_STORAGE_KEY, decision);

                    if (decision === 'approve') {
                        onApprove();
                    } else {
                        onReject();
                    }
                } catch (e) {
                    onReject();
                }
            }

            function emitConsent(consent) {
                var decision = decisionFor(consent);

                // In permissive mode Osano saves a default consent on its own while the
                // banner is still up. Forwarding that reloads the page under the banner,
                // and Osano then treats the consent as given and never shows it again.
                // Hold the decision until the visitor has actually done something.
                if (!visitorActed) {
                    pendingDecision = decision;
                    return;
                }

                forward(decision);
            }

            function onVisitorActed() {
                visitorActed = true;
                if (pendingDecision) {
                    var decision = pendingDecision;
                    pendingDecision = null;
                    forward(decision);
                }
            }

            w.Osano('onConsentSaved', emitConsent);
            // The dialog or drawer only closes on visitor input.
            w.Osano('onUiChanged', function (component, state) {
                if ((component === 'dialog' || component === 'drawer') && state === 'hide') {
                    onVisitorActed();
                }
            });

            injectOsano();
        });
    }

    if (w.attachEvent) {
        w.attachEvent('onload', l);
    } else {
        w.addEventListener('load', l, false);
    }
})();
