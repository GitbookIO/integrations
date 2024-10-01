function loadScript() {
    const divElement = document.createElement('div');
    divElement.id = 'scLangSelectorContainer';
    divElement.style.cssText = 'position:fixed; right:10px; bottom:10px; z-index:9999;';
    document.body.appendChild(divElement);
    const script = document.createElement('script');
    script.id = 'sc-script';
    script.src =
        'https://cdn.smartcat-proxy.com/<TOREPLACE>/script-v1/__translator.js?hash=<TOREPLACE>';
    document.head.appendChild(script);
}

(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadScript);
    } else {
        loadScript();
    }
})();
