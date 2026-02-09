(function (d, s) {
    const chatId = '<TO_REPLACE>';

    d = document;
    s = d.createElement('script');
    s.src = 'https://chat-assets.frontapp.com/v1/chat.bundle.js';
    s.async = 1;

    s.onload = function () {
        if (window.FrontChat) {
            window.FrontChat('init', { chatId: chatId, useDefaultLauncher: true });
        }

        // Workaround for Front's color-scheme bug
        // Front's widget uses color-scheme: normal which doesn't respect page color schemes
        // This override allows proper light/dark mode support
        const styleOverride = d.createElement('style');
        styleOverride.textContent = `
            [data-front-chat-container],
            [data-front-chat-container] iframe,
            #front-chat-container,
            #front-chat-container iframe {
                color-scheme: light dark !important;
            }
        `;
        d.head.appendChild(styleOverride);
    };

    // Append to body (just before closing </body> tag) as per Front's documentation
    d.getElementsByTagName('body')[0].appendChild(s);
})(window, document);
