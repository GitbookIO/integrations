(function (d, s) {
    const config = JSON.parse('<TO_REPLACE>');
    const widgetId = config.widgetId;

    window.$gurubase = [];
    window.GURUBASE_WIDGET_ID = widgetId;

    d = document;
    s = d.createElement('script');
    s.src = 'https://widget.gurubase.io/widget.latest.min.js';
    s.async = 1;
    s.setAttribute('data-widget-id', widgetId);

    if (config.text) {
        s.setAttribute('data-text', config.text);
    }
    if (config.margins) {
        s.setAttribute('data-margins', config.margins);
    }
    s.setAttribute('data-light-mode', "auto");
    if (config.bgColor) {
        s.setAttribute('data-bg-color', config.bgColor);
    }
    if (config.iconUrl) {
        s.setAttribute('data-icon-url', config.iconUrl);
    }
    if (config.name) {
        s.setAttribute('data-name', config.name);
    }
    if (config.baseUrl) {
        s.setAttribute('data-baseUrl', config.baseUrl);
    }

    s.id = 'guru-widget-id';
    d.getElementsByTagName('head')[0].appendChild(s);
})(window, document);
