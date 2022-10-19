const APP_ID = '<TO_REPLACE>';

window.intercomSettings = {
    app_id: APP_ID,
};

(function () {
    const w = window;
    const ic = w.Intercom;
    if (typeof ic === 'function') {
        ic('reattach_activator');
        ic('update', w.intercomSettings);
    } else {
        const d = document;
        const i = function () {
            // eslint-disable-next-line prefer-rest-params
            i.c(arguments);
        };
        i.q = [];
        i.c = function (args) {
            i.q.push(args);
        };
        w.Intercom = i;
        const l = function () {
            const s = d.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = `https://widget.intercom.io/widget/${APP_ID}`;
            s.onload = () => {
                ic('boot', {
                    app_id: APP_ID,
                });
            };

            const x = d.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);

            w.GitBook.addEventListener('unload', () => {
                if (!ic) {
                    return;
                }

                ic('shutdown');
                w.Intercom = undefined;
            });
        };
        if (document.readyState === 'complete') {
            l();
        } else if (w.attachEvent) {
            w.attachEvent('onload', l);
        } else {
            w.addEventListener('load', l, false);
        }
    }
})();
