(function (d, s) {
    const widgetId = '<TO_REPLACE>';
    window.$gurubase = [];
    window.GURUBASE_WIDGET_ID = widgetId;

    d = document;
    s = d.createElement('script');
    s.src = 'https://widget.gurubase.io/widget.latest.min.js';
    s.async = 1;
    s.setAttribute('data-widget-id', widgetId);
    s.id = 'guru-widget-id';
    d.getElementsByTagName('head')[0].appendChild(s);
})(window, document);
