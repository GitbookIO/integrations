function loadScript() {
    if (!document.getElementById(b)) {
        const trackingID = '<TO_REPLACE_SCRIPT_LOADER_ID>';

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

(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadScript);
    } else {
        loadScript();
    }
})();
