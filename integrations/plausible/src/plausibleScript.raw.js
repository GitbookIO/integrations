(function (doc, domain) {
    const sibling = doc.getElementsByTagName('script')[0];
    const element = doc.createElement('script');
    element.defer = true;
    element.setAttribute('data-domain', domain);
    element.src = '<host>/js/script.js';
    sibling.parentNode.insertBefore(element, sibling);
})(document, '<domain>');
