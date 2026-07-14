(function () {
    const APP_ID = '<TO_REPLACE>';
    const API_BASE = '<API_BASE>';
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

    if (getCookie(GRANTED_COOKIE) !== 'yes') {
        return;
    }

    window.intercomSettings = {
        app_id: APP_ID,
        api_base: API_BASE,
    };

    var w = window;
    var ic = w.Intercom;
    if (typeof ic === 'function') {
        ic('reattach_activator');
        ic('update', w.intercomSettings);
    } else {
        var d = document;
        var i = function () {
            i.c(arguments);
        };
        i.q = [];
        i.c = function (args) {
            i.q.push(args);
        };
        w.Intercom = i;
        var l = function () {
            var s = d.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = 'https://widget.intercom.io/widget/' + APP_ID;
            var x = d.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);

            w.GitBook.addEventListener('unload', () => {
                if (!ic) {
                    return;
                }

                ic('shutdown');
                w.Intercom = undefined;
            });
        };
        if (w.attachEvent) {
            w.attachEvent('onload', l);
        } else {
            w.addEventListener('load', l, false);
        }
    }
})();
