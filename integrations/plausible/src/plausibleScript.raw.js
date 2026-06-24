(function (doc) {
    var js = doc.createElement('script');
    js.async = true;
    js.src = '<scriptSrc>';
    var first = doc.getElementsByTagName('script')[0];
    if (first && first.parentNode) {
        first.parentNode.insertBefore(js, first);
    } else {
        (doc.head || doc.documentElement).appendChild(js);
    }

    window.plausible =
        window.plausible ||
        function () {
            (plausible.q = plausible.q || []).push(arguments);
        };
    plausible.init =
        plausible.init ||
        function (i) {
            plausible.o = i || {};
        };
    plausible.init();
})(document);
