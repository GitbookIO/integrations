!(function () {
    var analytics = (window.analytics = window.analytics || []);
    if (!analytics.initialize) {
        if (analytics.invoked) {
            window.console &&
                console.error &&
                console.error('CaliberMind snippet included twice.');
        } else {
            analytics.invoked = true;
            analytics.methods = [
                'trackSubmit',
                'trackClick',
                'trackLink',
                'trackForm',
                'pageview',
                'identify',
                'reset',
                'group',
                'track',
                'ready',
                'alias',
                'debug',
                'page',
                'once',
                'off',
                'on',
                'addSourceMiddleware',
                'addIntegrationMiddleware',
                'setAnonymousId',
                'addDestinationMiddleware',
            ];
            analytics.factory = function (method) {
                return function () {
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift(method);
                    analytics.push(args);
                    return analytics;
                };
            };
            for (var i = 0; i < analytics.methods.length; i++) {
                var key = analytics.methods[i];
                analytics[key] = analytics.factory(key);
            }
            analytics.load = function (name, options) {
                if (options) {
                    analytics._loadOptions = options;
                }
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.async = true;
                script.src =
                    (document.location.protocol === 'https:' ? 'https://' : 'http://') +
                    'cdn.calibermind.com/' +
                    name +
                    '.js';
                var first = document.getElementsByTagName('script')[0];
                first.parentNode.insertBefore(script, first);
            };
            analytics.SNIPPET_VERSION = '4.13.1';
            analytics.load('a', {
                writeKey: '<TO_REPLACE>',
                abmVendors: ['CLEARBIT', 'ROLLWORKS', 'SIXSENSE', 'BOMBORA', 'DEMANDBASE'],
            });
            analytics.load('js/fingerprint');
            analytics.load('js/abm');
        }
    }
})();
