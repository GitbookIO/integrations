(function (win, doc) {
    const trackingID = '<TO_REPLACE>';
    const js = doc.createElement('script');
    js.type = 'text/javascript'
    js.async = true;
    js.src = 'https://analytics.ahrefs.com/analytics.js';
    js.dataset['key'] = trackingID;
    const first = doc.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(js, first);
})(window, document);
