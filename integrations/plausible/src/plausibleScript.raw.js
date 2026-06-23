(function () {
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

    var s = document.createElement('script');
    s.async = true;
    s.src = '<scriptSrc>';
    document.head.appendChild(s);
})();
