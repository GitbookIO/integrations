(function () {
    const APP_ID = '<TO_REPLACE>';

    var w = window;

    var d = document;

    var l = function () {
        var s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://assets.salesmartly.com/js/' + APP_ID + '.js';
        var x = d.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
    };
    if (w.attachEvent) {
        w.attachEvent('onload', l);
    } else {
        w.addEventListener('load', l, false);
    }

})();