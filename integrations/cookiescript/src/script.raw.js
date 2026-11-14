(function () {
    var w = window;
    var d = document;

    var COOKIESCRIPT_ID = '<COOKIESCRIPT_ID>';

    // Cookie Script splits cookies into strict, functionality, performance, targeting and
    // unclassified. "strict" is always reported as granted -- it cannot be rejected -- so any
    // other category in the current state means the visitor allowed non-essential cookies.
    // See https://help.cookie-script.com/en/articles/30246-custom-functions
    var ESSENTIAL_CATEGORY = 'strict';

    function injectCookieScript() {
        var stub = d.getElementById('cookiescript-sdk-stub');
        if (stub) return;

        var s = d.createElement('script');
        s.id = 'cookiescript-sdk-stub';
        s.type = 'text/javascript';
        s.charset = 'UTF-8';
        s.async = true;
        s.src = 'https://cdn.cookie-script.com/s/' + COOKIESCRIPT_ID + '.js';
        d.head.appendChild(s);
    }

    /**
     * Read the categories Cookie Script currently reports as granted, or null while its SDK
     * hasn't initialized yet (or the visitor hasn't answered the banner).
     */
    function getGrantedCategories() {
        try {
            if (
                w.CookieScript &&
                w.CookieScript.instance &&
                typeof w.CookieScript.instance.currentState === 'function'
            ) {
                var state = w.CookieScript.instance.currentState();
                if (state && Array.isArray(state.categories)) return state.categories;
            }
        } catch (e) {}
        return null;
    }

    function l() {
        if (!w.GitBook || typeof w.GitBook.registerCookieBanner !== 'function') return;

        w.GitBook.registerCookieBanner(function (handlers) {
            var onApprove = handlers.onApprove;
            var onReject = handlers.onReject;
            var CONSENT_STORAGE_KEY = 'cookiescript-gitbook-last-consent-decision';

            function emitConsent() {
                var categories = getGrantedCategories();

                // No state yet means the visitor hasn't answered the banner: leave GitBook's
                // consent untouched instead of reporting a decision they haven't made.
                if (!categories) return;

                var hasNonEssential = categories.some(function (category) {
                    return category !== ESSENTIAL_CATEGORY;
                });
                var decision = hasNonEssential ? 'approve' : 'reject';

                try {
                    // Cookie Script replays the visitor's stored decision on every page load
                    // (e.g. CookieScriptLoaded), not just when it changes, and GitBook's
                    // onApprove/onReject reload the page to apply it. An in-memory de-dupe
                    // doesn't survive that reload, so forwarding the same replayed decision
                    // would reload -> replay -> reload forever. Persist the last decision in
                    // sessionStorage instead, which does survive the reload.
                    if (w.sessionStorage.getItem(CONSENT_STORAGE_KEY) === decision) return;
                    w.sessionStorage.setItem(CONSENT_STORAGE_KEY, decision);
                } catch (e) {
                    return;
                }

                // onApprove/onReject reload the page to apply the new consent state. For a
                // returning visitor whose stored decision GitBook already holds, forwarding it
                // again would reload on every page load, so skip decisions that change nothing.
                if (w.GitBook.isCookiesTrackingDisabled() === !hasNonEssential) return;

                if (hasNonEssential) {
                    onApprove();
                } else {
                    onReject();
                }
            }

            // CookieScriptLoaded fires once the instance -- and with it a returning visitor's
            // stored decision -- is available. Accept/Reject cover decisions made on this page.
            w.addEventListener('CookieScriptLoaded', emitConsent);
            w.addEventListener('CookieScriptAccept', emitConsent);
            w.addEventListener('CookieScriptAcceptAll', emitConsent);
            w.addEventListener('CookieScriptReject', emitConsent);

            injectCookieScript();

            // The banner may already have loaded before this listener was registered (another
            // script on the page injecting it, or a cached script running early), in which case
            // CookieScriptLoaded has been and gone. Read the state directly for that case.
            emitConsent();
        });
    }

    if (w.attachEvent) {
        w.attachEvent('onload', l);
    } else {
        w.addEventListener('load', l, false);
    }
})();
