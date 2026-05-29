(function () {
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

    function loadScript() {
        if (!document.getElementById('hs-script-loader')) {
            const trackingID = '<hubspot_id>';

            const scriptLoaderURL = '//js.hs-scripts.com/' + trackingID + '.js';
            const headTag = document.getElementsByTagName('head')[0];
            const scriptTag = document.createElement('script');
            scriptTag.src = scriptLoaderURL;
            scriptTag.type = 'text/javascript';
            scriptTag.id = 'hs-script-loader';
            scriptTag.async = 1;
            scriptTag.defer = 1;
            headTag.appendChild(scriptTag);
            const o = (window._hsp = window._hsp || []);
            o.push(['setContentType', 'knowledge-article']);
        }
    }

    if (getCookie(GRANTED_COOKIE) !== 'yes') {
        return;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadScript);
    } else {
        loadScript();
    }
})();
