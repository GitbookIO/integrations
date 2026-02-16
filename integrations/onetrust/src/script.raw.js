(function () {
    var w = window;
    var d = document;

    function injectOneTrust() {
        const stub = d.getElementById('onetrust-sdk-stub');
        if (stub) return;

        var s = d.createElement('script');
        s.id = 'onetrust-sdk-stub';
        s.type = 'text/javascript';
        s.async = true;
        s.charset = 'UTF-8';
        s.setAttribute('data-document-language', 'true');
        s.setAttribute('data-domain-script', '<DOMAIN_SCRIPT_ID>');
        s.src = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';
        d.head.appendChild(s);

        if (typeof w.OptanonWrapper !== 'function') {
            w.OptanonWrapper = () => {};
        }
    }

    function l() {
        if (!w.GitBook || typeof w.GitBook.registerCookieBanner !== 'function') return;

        const cookieState = w.GitBook.isCookiesTrackingDisabled();
        const hasGrantedCookies = cookieState !== undefined;

        w.GitBook.registerCookieBanner(function ({ onApprove, onReject }) {
            injectOneTrust();

            function emitConsent() {
                try {
                    var groups = (w.OnetrustActiveGroups || '').split(',');
                    var hasNonEssential = groups.some(function (g) {
                        var t = g && g.trim();
                        return t && t !== 'C0001';
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

            var previousOptanonWrapper = w.OptanonWrapper;
            w.OptanonWrapper = function () {
                previousOptanonWrapper && previousOptanonWrapper();
                try {
                    w.dispatchEvent(new Event('onetrust-banner-loaded'));
                    // Emit initial consent for returning visitors (OnetrustActiveGroups
                    // is populated from stored consent; OTConsentApplied won't fire)
                    if (!hasGrantedCookies && w.OnetrustActiveGroups !== undefined) {
                        emitConsent();
                    }
                } catch (e) {}
            };

            // OTConsentApplied fires when user clicks Accept/Reject
            w.addEventListener('OTConsentApplied', function () {
                if (!hasGrantedCookies) {
                    emitConsent();
                }
            });
        });
    }

    if (w.attachEvent) {
        w.attachEvent('onload', l);
    } else {
        w.addEventListener('load', l, false);
    }
})();
