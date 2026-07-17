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

            function emitConsent(consent) {
                try {
                    var hasNonEssential =
                        !!consent &&
                        NON_ESSENTIAL_CATEGORIES.some(function (category) {
                            return consent[category] === 'ACCEPT';
                        });
                    if (hasNonEssential) {
                        onApprove();
                    } else {
                        onReject();
                    }
                } catch (e) {
                    onReject();
                }
            }

            // osano-cm-consent-saved fires immediately with the existing Consent Object
            // for a returning visitor who already answered, and again on every future
            // save (including one triggered by a Global Privacy Control signal, which
            // Osano honors natively). Unlike OneTrust, there's no need to guard against
            // a premature default-state callback here: this event simply never fires
            // until the visitor (or GPC) has actually recorded a decision.
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
