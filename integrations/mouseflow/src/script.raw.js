const websiteId = '<TO_REPLACE>';

window._mfq = window._mfq || [];
(function() {
    var mf = document.createElement("script");
    mf.type = "text/javascript";
    mf.defer = true;
    mf.src = "//cdn.mouseflow.com/projects/" + websiteId + ".js";
    document.getElementsByTagName("head")[0].appendChild(mf);
})();
