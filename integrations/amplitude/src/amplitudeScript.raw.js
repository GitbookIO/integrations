(function (w, d, s, apiKey) {
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

    var f = d.getElementsByTagName(s)[0];

    // Create and inject the Amplitude CDN script
    var j = d.createElement(s);
    j.async = true;
    j.src = 'https://cdn.amplitude.com/script/' + apiKey + '.js';
    j.referrerPolicy = 'no-referrer-when-downgrade';
    j.onload = function () {
        window.amplitude.add(window.sessionReplay.plugin({ sampleRate: 1 }));
        window.amplitude.init(apiKey, {
            fetchRemoteConfig: true,
            autocapture: true,
        });
    };
    f.parentNode.insertBefore(j, f);
})(window, document, 'script', '<TO_REPLACE>');
