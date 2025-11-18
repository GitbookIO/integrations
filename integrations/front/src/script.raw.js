((d, s) => {
	const chatId = '<TO_REPLACE>';

	d = document;
	s = d.createElement('script');
	s.src = 'https://chat-assets.frontapp.com/v1/chat.bundle.js';
	s.async = 1;

	s.onload = () => {
		if (window.FrontChat) {
			window.FrontChat('init', { chatId: chatId, useDefaultLauncher: true });
		}
	};

	// Append to body (just before closing </body> tag) as per Front's documentation
	d.getElementsByTagName('body')[0].appendChild(s);
})(window, document);
