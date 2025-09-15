(function (d, s) {
    const chatId = '<TO_REPLACE>';

    d = document;
    s = d.createElement('script');
    s.src = 'https://chat-assets.frontapp.com/v1/chat.bundle.js';
    s.async = 1;
    d.getElementsByTagName('head')[0].appendChild(s);

    s.onload = function () {
        if (window.FrontChat) {
            window.FrontChat('init', { chatId: chatId, useDefaultLauncher: true });
        }
    };

    d.getElementsByTagName('head')[0].appendChild(s);
})(window, document);
