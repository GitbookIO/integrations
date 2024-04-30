(function (z, e, n) {
    const trackingID = '<TO_REPLACE>';
    z._trackingID = trackingID;

    z = e.getElementsByTagName('head')[0];
    n = e.createElement('meta');
    n.name = 'zd-site-verification';
    n.content = `${z._trackingID}`;
    z.appendChild(n);
})(window, document);
