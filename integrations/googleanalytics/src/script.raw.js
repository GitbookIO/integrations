(function (win, doc, script, layer) {
    const id = '<TO_REPLACE>';
    const GRANTED_COOKIE = '__gitbook_cookie_granted';

    function triggerView(win) {
        win.gtag('event', 'page_view', {
            page_path: win.location.pathname,
            page_location: win.location.href,
            page_title: win.document.title,
            send_to: 'tracking_views',
        });
    }

    function getCookie(cname) {
        const name = `${cname}=`;
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    let disableCookies = false;
    const cookie = getCookie(GRANTED_COOKIE);
    if (cookie === 'yes') {
        disableCookies = false;
    } else if (cookie === 'no') {
        disableCookies = true;
    }

    win[layer] = win[layer] || [];
    win.gtag = function () {
        win[layer].push(arguments);
    };

    win.gtag('js', new Date());
    win.gtag('config', id);
    win.gtag('consent', 'default', {
        ad_storage: disableCookies ? 'denied' : 'granted',
        analytics_storage: disableCookies ? 'denied' : 'granted',
    });
    const f = doc.getElementsByTagName(script)[0],
        j = doc.createElement(script),
        dl = layer !== 'dataLayer' ? `&l=${layer}` : '';
    j.async = true;
    j.src = `https://www.googletagmanager.com/gtag/js?id=${id}${dl}`;
    j.onload = function () {
        win.gtag('config', id, {
            send_page_view: false,
            anonymize_ip: true,
            groups: 'tracking_views',
            ...(disableCookies
                ? {
                      client_storage: 'none',
                  }
                : {}),
        });
        triggerView(win);

        win.history.pushState = new Proxy(win.history.pushState, {
            apply: (target, thisArg, argArray) => {
                triggerView(win);
                return target.apply(thisArg, argArray);
            },
        });
    };
    f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer');
