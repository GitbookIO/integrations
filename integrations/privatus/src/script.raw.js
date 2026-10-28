(function (doc, siteId, modules) {
    if (doc.querySelector('script[data-site="' + siteId + '"][src$="/js/pa.js"]')) {
        return;
    }

    var js = doc.createElement('script');
    js.defer = true;
    js.src = 'https://privatusstats.com/js/pa.js';
    js.setAttribute('data-site', siteId);
    js.setAttribute('data-modules', modules);

    (doc.head || doc.documentElement).appendChild(js);
})(document, '<SITE_ID>', '<MODULES>');
