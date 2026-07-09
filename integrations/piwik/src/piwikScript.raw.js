(function (window, document, dataLayerName, id) {
    var GRANTED_COOKIE = '__gitbook_cookie_granted';

    function getCookie(cname) {
        var name = cname + '=';
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
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

    (window[dataLayerName] = window[dataLayerName] || []),
        window[dataLayerName].push({ start: new Date().getTime(), event: 'stg.start' });
    var scripts = document.getElementsByTagName('script')[0],
        tags = document.createElement('script');
    function stgCreateCookie(a, b, c) {
        var d = '';
        if (c) {
            var e = new Date();
            e.setTime(e.getTime() + 24 * c * 60 * 60 * 1e3), (d = '; expires=' + e.toUTCString());
            f = '; SameSite=Strict';
        }
        document.cookie = a + '=' + b + d + f + '; path=/';
    }
    var isStgDebug =
        (window.location.href.match('stg_debug') || document.cookie.match('stg_debug')) &&
        !window.location.href.match('stg_disable_debug');
    stgCreateCookie('stg_debug', isStgDebug ? 1 : '', isStgDebug ? 14 : -1);
    var qP = [];
    dataLayerName !== 'dataLayer' && qP.push('data_layer_name=' + dataLayerName),
        isStgDebug && qP.push('stg_debug');
    var qPString = qP.length > 0 ? '?' + qP.join('&') : '';
    (tags.async = !0),
        (tags.src = '<PIWIK_CONTAINER_URL>' + id + '.js' + qPString),
        scripts.parentNode.insertBefore(tags, scripts);
    !(function (a, n, i) {
        a[n] = a[n] || {};
        for (var c = 0; c < i.length; c++)
            !(function (i) {
                (a[n][i] = a[n][i] || {}),
                    (a[n][i].api =
                        a[n][i].api ||
                        function () {
                            var a = [].slice.call(arguments, 0);
                            'string' == typeof a[0] &&
                                window[dataLayerName].push({
                                    event: n + '.' + i + ':' + a[0],
                                    parameters: [].slice.call(arguments, 1),
                                });
                        });
            })(i[c]);
    })(window, 'ppms', ['tm', 'cm']);
})(window, document, '<PIWIK_DATA_LAYER_NAME>', '<PIWIK_SITE_ID>');
