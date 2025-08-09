(function () {
    var MATOMO_URL = '<MATOMO_SERVER_URL>';
    var SITE_ID = '<MATOMO_SITE_ID>';
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

    function sendPageview() {
        // Respect cookie consent
        if (getCookie(GRANTED_COOKIE) !== 'yes') {
            return;
        }

        try {
            var url = MATOMO_URL + '/matomo.php';
            var params = {
                idsite: SITE_ID,
                rec: 1,
                url: window.location.href,
                action_name: document.title,
                rand: String(Math.random()).slice(2),
            };

            var query = Object.keys(params)
                .map(function (k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
                })
                .join('&');

            var beacon = new Image();
            beacon.src = url + '?' + query;
        } catch (e) {
            // ignore errors
        }
    }

    // Track initial view and SPA navigations
    var lastPathname;
    function trackIfPathChanged() {
        if (lastPathname !== window.location.pathname) {
            lastPathname = window.location.pathname;
            sendPageview();
        }
    }

    // Initial
    trackIfPathChanged();

    // Listen to SPA navigation via pushState and popstate
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


