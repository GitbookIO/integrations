(function (doc, siteId, trackExternalLinks) {
    const sibling = doc.getElementsByTagName('script')[0];
    const element = doc.createElement('script');
    element.defer = true;
    element.setAttribute('data-site', siteId);
    element.setAttribute('data-spa', 'auto');
    element.src = 'https://cdn.usefathom.com/script.js';
    const GRANTED_COOKIE = '__gitbook_cookie_granted';

    function getCookie(cname) {
        const name = `${cname}=`;
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    // Function to track external links
    function trackExternalLink(event) {
        if (getCookie(GRANTED_COOKIE) !== 'yes') {
            return;
        }

        var item = event.target.closest('a');
        if (!item) return;

        var linkUrl = new URL(item.getAttribute('href'), window.location.href);
        var currentHostname = window.location.hostname;

        if (linkUrl.hostname !== currentHostname) {
            // We simply track the full url as an event.
            window.fathom.trackEvent('External link clicked: ' + linkUrl.href);
        }
    }

    element.onload = function () {
        if (trackExternalLinks === true || trackExternalLinks === 'true') {
            // Use event delegation to capture clicks on all current and later loaded links
            doc.addEventListener('click', trackExternalLink);
        }
    };

    sibling.parentNode.insertBefore(element, sibling);
})(document, '<TO_REPLACE_SITE_ID>', '<TO_REPLACE_TRACK_EXTERNAL_LINKS>');
