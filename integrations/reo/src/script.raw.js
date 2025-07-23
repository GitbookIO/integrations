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

(function (r, e, o) {
    const disableCookies = getCookie(GRANTED_COOKIE) !== 'yes';

    if (disableCookies) {
        return;
    }

    var t, c, n;
    c = { clientID: trackingID };
    t = function () {
        Reo.init(c);
    };
    n = e.createElement('script');
    n.src = o + c.clientID + '/reo.js';
    n.async = !0;
    n.onload = t;

    e.head.appendChild(n);
})(window, document, 'https://static.reo.dev/');
