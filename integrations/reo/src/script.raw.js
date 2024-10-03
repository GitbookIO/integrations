const trackingID = '<TO_REPLACE>';

(function (r, e, o) {
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
