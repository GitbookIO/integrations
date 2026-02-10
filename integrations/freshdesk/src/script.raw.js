window.fwSettings = {
    widget_id: '<WIDGET_ID>',
};
!(function () {
    if ('function' != typeof window.FreshworksWidget) {
        var n = function () {
            n.q.push(arguments);
        };
        n.q = [];
        window.FreshworksWidget = n;
    }
})();

(function () {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = '<WIDGET_URL>';
    s.async = true;
    s.defer = true;
    document.getElementsByTagName('head')[0].appendChild(s);
})();
