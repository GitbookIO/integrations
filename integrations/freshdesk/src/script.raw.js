window.fwSettings = {
    widget_id: '<TO_REPLACE>',
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
    s.src = 'https://widget.freshworks.com/widgets/<TO_REPLACE>.js';
    s.async = true;
    s.defer = true;
    document.getElementsByTagName('head')[0].appendChild(s);
})();
