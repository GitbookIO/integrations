// https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/administration/additional-integrations/add-munchkin-tracking-code-to-your-website
(function () {
    let didInit = false;
    const document = window.document;
    const accountId = '<account>';
    const workspace = '<workspace>';

    function initMunchkin() {
        if (didInit === false) {
            didInit = true;
            Munchkin.init(accountId, workspace.length ? { wsInfo: workspace } : undefined);
        }
    }
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = '//munchkin.marketo.net/munchkin.js';
    s.onreadystatechange = function () {
        if (this.readyState == 'complete' || this.readyState == 'loaded') {
            initMunchkin();
        }
    };
    s.onload = initMunchkin;
    document.getElementsByTagName('head')[0].appendChild(s);
})();
