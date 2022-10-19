(function (doc, siteID) {
    const sibling = doc.getElementsByTagName('script')[0];
    const element = doc.createElement('script');
    element.defer = true;
    element.setAttribute('data-site', siteID);
    element.setAttribute('data-spa', 'auto');
    element.src = 'https://cdn.usefathom.com/script.js';
    sibling.parentNode.insertBefore(element, sibling);
})(document, '<TO_REPLACE>');
