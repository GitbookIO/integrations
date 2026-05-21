(function () {
    var w = window;
    var d = document;

    function injectCookiebot() {
        const existing = d.getElementById('Cookiebot');
        if (existing) return;

        var s = d.createElement('script');
        s.id = 'Cookiebot';
        s.type = 'text/javascript';
        s.src = 'https://consent.cookiebot.com/uc.js';
        s.setAttribute('data-cbid', '<CBID>');
        __BLOCKING_MODE__;
        d.head.appendChild(s);
    }

    function l() {
        if (!w.GitBook || typeof w.GitBook.registerCookieBanner !== 'function') return;

        const cookieState = w.GitBook.isCookiesTrackingDisabled();
        const hasRecordedConsent = cookieState !== undefined;

        w.GitBook.registerCookieBanner(function ({ onApprove, onReject }) {
            injectCookiebot();

            function emitConsent() {
                try {
                    var c = w.Cookiebot;
                    if (!c || !c.consent) {
                        onReject();
                        return;
                    }
                    if (c.declined) {
                        onReject();
                        return;
                    }
                    var hasNonEssential =
                        c.consent.preferences || c.consent.statistics || c.consent.marketing;
                    if (hasNonEssential) {
                        onApprove();
                    } else {
                        onReject();
                    }
                } catch (e) {
                    onReject();
                }
            }

            w.addEventListener('CookiebotOnAccept', function () {
                if (!hasRecordedConsent) {
                    emitConsent();
                }
            });

            w.addEventListener('CookiebotOnDecline', function () {
                if (!hasRecordedConsent) {
                    onReject();
                }
            });

            w.addEventListener('CookiebotOnConsentReady', function () {
                if (!hasRecordedConsent && w.Cookiebot && w.Cookiebot.hasResponse) {
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
