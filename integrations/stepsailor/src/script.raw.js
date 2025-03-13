(function (d, s) {
    d = document;
    s = d.createElement('script');
    s.src = 'https://static.api.stepsailor.com/orion-ai/index.js';
    s.setAttribute('data-company-id', '<TO_REPLACE_ORGANIZATION_ID>');
    s.setAttribute('data-deploy-config-id', '<TO_REPLACE_DEPLOY_CONFIG_ID>');
    s.setAttribute('data-secret', '<TO_REPLACE_API_KEY>');
    s.async = 1;
    d.getElementsByTagName('body')[0].appendChild(s);
})(window, document);
