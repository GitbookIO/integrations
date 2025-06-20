(function (doc, key) {
    var s = doc.createElement('script');
    s.src = 'https://analytics.ahrefs.com/analytics.js';
    s.setAttribute('data-key', key);
    s.async = true;
    var first = doc.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(s, first);
})(document, '<TO_REPLACE>');
