(function (doc, domain, api) {
    const sibling = doc.getElementsByTagName('script')[0];
    const element = doc.createElement('script');

    element.defer = true;
    element.setAttribute('data-domain', domain);

    if (api) {
        element.setAttribute('data-api', api);
    }

    element.src = 'https://plausible.io/js/script.js';
    sibling.parentNode.insertBefore(element, sibling);
})(document, '<domain>', '<api>');
