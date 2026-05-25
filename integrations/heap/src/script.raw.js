(function (win, doc) {
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

    if (getCookie(GRANTED_COOKIE) !== 'yes') {
        return;
    }

    win.heap = win.heap || [];
    heap.load = function (e, t) {
        (win.heap.appid = e), (win.heap.config = t = t || {});
        var r = doc.createElement('script');
        (r.type = 'text/javascript'),
            (r.async = !0),
            (r.src = 'https://cdn.heapanalytics.com/js/heap-' + e + '.js');
        var a = doc.getElementsByTagName('script')[0];
        a.parentNode.insertBefore(r, a);
        for (
            var n = function (e) {
                    return function () {
                        heap.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                    };
                },
                p = [
                    'addEventProperties',
                    'addUserProperties',
                    'clearEventProperties',
                    'identify',
                    'resetIdentity',
                    'removeEventProperty',
                    'setEventProperties',
                    'track',
                    'unsetEventProperty',
                ],
                o = 0;
            o < p.length;
            o++
        )
            heap[p[o]] = n(p[o]);
    };
    heap.load(trackingID);
})(window, document);
