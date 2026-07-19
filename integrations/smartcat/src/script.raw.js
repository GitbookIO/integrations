function loadScript() {
    const smartCatScriptTag = '<TOREPLACE>';

    const smartcatOrgIDRegExp =
        'https://cdn.smartcat-proxy.com/([^/]+)/script-v1/__translator.js?hash=.*';

    const smartcatHashRegExp =
        'https://cdn.smartcat-proxy.com/[^/]+/script-v1/__translator.js?hash=([^/]+)';

    const smartcatOrgID = smartCatScriptTag.match(smartcatOrgIDRegExp)[1];
    const smartcatHash = smartCatScriptTag.match(smartcatHashRegExp)[1];

    const divElement = document.createElement('div');
    divElement.id = 'scLangSelectorContainer';
    divElement.style.cssText = 'position:fixed; right:10px; bottom:10px; z-index:9999;';
    document.body.appendChild(divElement);
    const script = document.createElement('script');
    script.id = 'sc-script';
    script.src = `https://cdn.smartcat-proxy.com/${smartcatOrgID}/script-v1/__translator.js?hash=${smartcatHash}`;
    document.head.appendChild(script);
}

(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadScript);
    } else {
        loadScript();
    }
})();
