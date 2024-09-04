(function (doc, siteId, trackExternalLinks) {
    const sibling = doc.getElementsByTagName('script')[0];
    const element = doc.createElement('script');
    element.defer = true;
    element.setAttribute('data-site', siteId);
    element.setAttribute('data-spa', 'auto');
    element.src = 'https://cdn.usefathom.com/script.js';

    // Function to track external links https://github.com/GitbookIO/integrations/issues/450
    element.onload = function () {
        if (trackExternalLinks === true || trackExternalLinks === 'true') {
            window.addEventListener('load', function (event) {
                doc.querySelectorAll('a').forEach(function (item) {
                    item.addEventListener('click', function (event) {
                        var linkUrl = new URL(item.getAttribute('href'), window.location.href);
                        var currentHostname = window.location.hostname;

                        if (linkUrl.hostname !== currentHostname) {
                            var domainParts = linkUrl.hostname.split('.');
                            var domainName =
                                domainParts.length > 1
                                    ? domainParts[domainParts.length - 2]
                                    : domainParts[0];

                            window.fathom.trackEvent('External link clicked: ' + domainName);
                        }
                    });
                });
            });
        }
    };

    sibling.parentNode.insertBefore(element, sibling);
})(document, '<TO_REPLACE>');
