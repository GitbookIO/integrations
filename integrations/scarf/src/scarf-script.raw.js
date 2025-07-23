(function () {
    try {
        const pixelID = '1234567890';
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

        let lastHref = null;
        
        const cookieGranted = getCookie(GRANTED_COOKIE);

        function sendScarfPing() {
            if(cookieGranted !== 'yes'){
                return;
            }
        
            const currentHref = window.location.href;
            if (currentHref === lastHref) return;
            lastHref = currentHref;

            const url = `https://static.scarf.sh/a.png?x-pxid=${pixelID}`;
            const img = new Image();
            img.referrerPolicy = 'no-referrer-when-downgrade';
            img.src = url;
        }

        ['pushState', 'replaceState'].forEach((fn) => {
            const original = history[fn];
            history[fn] = function () {
                original.apply(this, arguments);
                window.dispatchEvent(new Event('scarf:locationchange'));
            };
        });

        window.addEventListener('hashchange', sendScarfPing);
        window.addEventListener('popstate', sendScarfPing);
        window.addEventListener('scarf:locationchange', sendScarfPing);

        const cookieGranted = getCookie(GRANTED_COOKIE);
        if (cookieGranted == 'yes') {
            sendScarfPing();
        }
    } catch (err) {
        console.error(err);
    }
})();
