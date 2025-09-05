// Taken from plausible.io/js/script.js
(function () {
    const currentUrl = window.location;
    const document = window.document;

    const apiUrl = '<api>' || 'https://plausible.io/api/event';
    const domain = '<domain>';

    function logIgnoredEvent(event) {
        console.warn('Ignoring Event: ' + event);
    }

    function trackEvent(eventName, options) {
        if (
            /^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(currentUrl.hostname) ||
            'file:' === currentUrl.protocol
        ) {
            return logIgnoredEvent('localhost');
        }

        if (
            !(window._phantom || window.__nightmare || window.navigator.webdriver || window.Cypress)
        ) {
            try {
                if (window.localStorage.plausible_ignore === 'true') {
                    return logIgnoredEvent('localStorage flag');
                }
            } catch (error) {
                // do nothing
            }

            const eventData = {};
            eventData.name = eventName;
            eventData.url = currentUrl.href;
            eventData.domain = domain;
            eventData.referrer = document.referrer || null;
            eventData.width = window.innerWidth;
            if (options && options.meta) {
                eventData.meta = JSON.stringify(options.meta);
            }
            if (options && options.props) {
                eventData.props = options.props;
            }

            const xhr = new XMLHttpRequest();
            xhr.open('POST', apiUrl, true);
            xhr.setRequestHeader('Content-Type', 'text/plain');
            xhr.send(JSON.stringify(eventData));
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && options && options.callback) {
                    options.callback();
                }
            };
        }
    }

    const eventQueue = (window.plausible && window.plausible.q) || [];
    window.plausible = trackEvent;
    for (let i = 0; i < eventQueue.length; i++) {
        trackEvent.apply(this, eventQueue[i]);
    }

    let currentPagePath;
    function trackPageView() {
        if (currentPagePath !== currentUrl.pathname) {
            currentPagePath = currentUrl.pathname;
            trackEvent('pageview');
        }
    }

    let originalPushState;
    const history = window.history;
    if (history.pushState) {
        originalPushState = history.pushState;
        history.pushState = function () {
            originalPushState.apply(this, arguments);
            trackPageView();
        };
        window.addEventListener('popstate', trackPageView);
    }

    if (document.visibilityState === 'prerender') {
        document.addEventListener('visibilitychange', function () {
            if (!currentPagePath && document.visibilityState === 'visible') {
                trackPageView();
            }
        });
    } else {
        trackPageView();
    }
})();
