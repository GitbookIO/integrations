(function (d, s) {
    const trackingID = '<TO_REPLACE>';
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = trackingID;

    d = document;
    s = d.createElement('script');
    s.src = 'https://client.crisp.chat/l.js';
    s.async = 1;
    d.getElementsByTagName('head')[0].appendChild(s);
})(window, document);
