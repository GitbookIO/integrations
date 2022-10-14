(function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
    });
    const f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l !== 'dataLayer' ? `&l=${l}` : '';
    j.async = true;
    j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
    j.onload = function () {
        window.dataLayer = window.dataLayer || [];
        function gtag(...args) {
            window.dataLayer.push(args);
        }
        gtag('js', new Date());

        gtag('config', i, {
            send_page_view: false,
            anonymize_ip: true,
            groups: 'tracking_views',
        });
    };
    f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-<TO_REPLACE>');
