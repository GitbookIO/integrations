(function () {
    var MATOMO_URL = '<MATOMO_SERVER_URL>';
    var SITE_ID = '<MATOMO_SITE_ID>';
    var LOAD_JS_TRACKER = '<LOAD_JS_TRACKER>' === 'true';
    var TRACK_REFERRER = '<TRACK_REFERRER>' === 'true';
    var TRACK_OUTBOUND = '<TRACK_OUTBOUND>' === 'true';
    var CLICK_SELECTORS = '<CLICK_SELECTORS>';
    var GOAL_MAPPINGS_JSON = '<GOAL_MAPPINGS_JSON>';
    var USER_ID_COOKIE = '<USER_ID_COOKIE>';
    var GRANTED_COOKIE = '__gitbook_cookie_granted';

    function getCookie(name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return '';
    }

    function hasConsent() {
        return getCookie(GRANTED_COOKIE) === 'yes';
    }

    function urlParams(baseUrl, params) {
        return (
            baseUrl +
            '?' +
            Object.keys(params)
                .filter(function (k) {
                    return params[k] !== undefined && params[k] !== '' && params[k] !== null;
                })
                .map(function (k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
                })
                .join('&')
        );
    }

    function sendBeacon(params) {
        if (!hasConsent()) return;
        try {
            var url = MATOMO_URL + '/matomo.php';
            var beacon = new Image();
            beacon.src = urlParams(url, params);
        } catch (e) {}
    }

    function getReferrer() {
        return TRACK_REFERRER ? document.referrer || '' : '';
    }

    function getUserId() {
        if (!USER_ID_COOKIE) return '';
        return getCookie(USER_ID_COOKIE) || '';
    }

    function trackPageview() {
        if (LOAD_JS_TRACKER && window._paq) {
            window._paq.push(['setReferrerUrl', getReferrer()]);
            var uid = getUserId();
            if (uid) window._paq.push(['setUserId', uid]);
            window._paq.push(['setDocumentTitle', document.title]);
            window._paq.push(['setCustomUrl', window.location.href]);
            window._paq.push(['trackPageView']);
            return;
        }
        // Beacon fallback
        sendBeacon({
            idsite: SITE_ID,
            rec: 1,
            url: window.location.href,
            action_name: document.title,
            urlref: getReferrer(),
            uid: getUserId(),
            rand: String(Math.random()).slice(2),
        });
    }

    function trackEvent(category, action, name, value) {
        if (LOAD_JS_TRACKER && window._paq) {
            var uid = getUserId();
            if (uid) window._paq.push(['setUserId', uid]);
            if (TRACK_REFERRER) window._paq.push(['setReferrerUrl', getReferrer()]);
            window._paq.push(['trackEvent', category, action, name, value]);
            return;
        }
        sendBeacon({
            idsite: SITE_ID,
            rec: 1,
            e_c: category,
            e_a: action,
            e_n: name,
            e_v: value,
            url: window.location.href,
            urlref: getReferrer(),
            uid: getUserId(),
            rand: String(Math.random()).slice(2),
        });
    }

    function bindClicks() {
        // Track configured selectors
        if (CLICK_SELECTORS && CLICK_SELECTORS.trim()) {
            try {
                var selectors = CLICK_SELECTORS.split(',');
                selectors.forEach(function (sel) {
                    sel = sel.trim();
                    if (!sel) return;
                    document.addEventListener('click', function (e) {
                        var target = e.target;
                        if (!(target instanceof Element)) return;
                        var el = target.closest(sel);
                        if (!el) return;
                        var label = (el.textContent || el.getAttribute('aria-label') || '').trim();
                        var href = el.getAttribute && el.getAttribute('href');
                        trackEvent('Click', 'click', label || href || sel);
                    });
                });
            } catch (e) {}
        }

        // Track outbound links if enabled
        if (TRACK_OUTBOUND) {
            document.addEventListener('click', function (e) {
                var target = e.target;
                if (!(target instanceof Element)) return;
                var link = target.closest('a[href]');
                if (!link) return;
                try {
                    var url = new URL(link.href, window.location.href);
                    if (url.host && url.host !== window.location.host) {
                        trackEvent('Outbound', 'click', url.href);
                    }
                } catch (err) {}
            });
        }
    }

    function applyGoals() {
        if (!GOAL_MAPPINGS_JSON) return;
        var mappings;
        try {
            mappings = JSON.parse(GOAL_MAPPINGS_JSON);
        } catch (e) {
            return;
        }
        if (!mappings || typeof mappings !== 'object') return;
        document.addEventListener('click', function (e) {
            var target = e.target;
            if (!(target instanceof Element)) return;
            for (var sel in mappings) {
                var goalId = mappings[sel];
                if (!goalId) continue;
                var el = target.closest(sel);
                if (el) {
                    if (LOAD_JS_TRACKER && window._paq) {
                        window._paq.push(['trackGoal', Number(goalId)]);
                    } else {
                        sendBeacon({ idsite: SITE_ID, rec: 1, idgoal: Number(goalId), rand: String(Math.random()).slice(2) });
                    }
                    break;
                }
            }
        });
    }

    function loadJS() {
        if (!LOAD_JS_TRACKER) return;
        if (!hasConsent()) return;
        var _paq = (window._paq = window._paq || []);
        var uid = getUserId();
        if (uid) _paq.push(['setUserId', uid]);
        if (TRACK_REFERRER) _paq.push(['setReferrerUrl', getReferrer()]);
        _paq.push(['enableLinkTracking']);
        _paq.push(['setTrackerUrl', MATOMO_URL + '/matomo.php']);
        _paq.push(['setSiteId', SITE_ID]);

        var g = document.createElement('script');
        g.async = true;
        g.src = MATOMO_URL + '/matomo.js';
        g.onload = function () {
            // Track initial after JS ready
            trackPageview();
        };
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(g, s);
    }

    // Detect SPA navigation and track
    var lastPathname;
    function trackIfPathChanged() {
        if (lastPathname !== window.location.pathname) {
            lastPathname = window.location.pathname;
            trackPageview();
        }
    }

    // Init
    bindClicks();
    applyGoals();
    loadJS();
    trackPageview();

    var originalPushState = window.history.pushState;
    if (originalPushState) {
        window.history.pushState = new Proxy(originalPushState, {
            apply: function (target, thisArg, args) {
                var result = target.apply(thisArg, args);
                trackIfPathChanged();
                return result;
            },
        });
    }
    window.addEventListener('popstate', trackIfPathChanged);
})();


