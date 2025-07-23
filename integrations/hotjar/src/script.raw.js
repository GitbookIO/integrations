(function (h, o, t, j, a, r) {
    const trackingID = '<TO_REPLACE>';

    const GRANTED_COOKIE = '__gitbook_cookie_granted';

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

    const disableCookies = getCookie(GRANTED_COOKIE) !== 'yes';

    if (disableCookies) {
        return;
    }

    h.hj =
        h.hj ||
        function () {
            (h.hj.q = h.hj.q || []).push(arguments);
        };
    h._hjSettings = { hjid: trackingID, hjsv: 6 };
    a = o.getElementsByTagName('head')[0];
    r = o.createElement('script');
    r.async = 1;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
})(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
