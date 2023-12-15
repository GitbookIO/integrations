(function (win, doc) {
    const trackingID = '<TO_REPLACE>';
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
