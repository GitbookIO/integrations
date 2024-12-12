(function (apiKey) {
    (function (p, e, n, d, o) {
        var v, w, x, y, z;
        o = p[d] = p[d] || {};
        o._q = o._q || [];
        v = ['initialize', 'identify', 'updateOptions', 'pageLoad', 'track'];
        for (w = 0, x = v.length; w < x; ++w)
            (function (m) {
                o[m] =
                    o[m] ||
                    function () {
                        o._q[m === v[0] ? 'unshift' : 'push'](
                            [m].concat([].slice.call(arguments, 0)),
                        );
                    };
            })(v[w]);
        y = e.createElement(n);
        y.async = !0;
        var cdn;
        cdn = '<REGION>' === 'EU' ? 'https://cdn.eu.pendo.io' : 'https://cdn.pendo.io';
        y.src = `${cdn}/agent/static/` + apiKey + '/pendo.js';
        z = e.getElementsByTagName(n)[0];
        z.parentNode.insertBefore(y, z);
        y.onload = function () {
            pendo.initialize({
                visitor: {
                    id: 'id',
                    email: 'email',
                    firstName: 'firstName',
                    lastName: 'lastName',
                },
                account: {
                    id: 'accountId',
                    accountName: 'accountName',
                    payingStatus: 'payingStatus',
                },
            });
        };
    })(window, document, 'script', 'pendo');
})('<TO_REPLACE>');
