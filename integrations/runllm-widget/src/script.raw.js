(function () {
    var w = window;

    const NAME = '<NAME>';
    const SERVER_ADDRESS = '<SERVER_ADDRESS>';
    const ASSISTANT_ID = '<ASSISTANT_ID>';
    const POSITION = '<POSITION>';
    const KEYBOARD_SHORTCUT = '<KEYBOARD_SHORTCUT>';
    const THEME_COLOR = '<THEME_COLOR>';
    const BRAND_LOGO = '<BRAND_LOGO>';
    const COMMUNITY_URL = '<COMMUNITY_URL>';
    const COMMUNITY_TYPE = '<COMMUNITY_TYPE>';
    const DISABLE_ASK_A_PERSON = '<DISABLE_ASK_A_PERSON>';
    const NATIVE_AI_EXPERIENCE = '<NATIVE_AI_EXPERIENCE>';

    // Helper: only set attribute if value is real (not a placeholder or "undefined")
    function setAttr(el, name, value) {
        if (!value) return;
        // If value looks like a placeholder <FOO> or literal "undefined", skip
        if (/^<[^>]+>$/.test(value) || value === 'undefined') return;
        el.setAttribute(name, value);
    }

    // Register GitBook assistant immediately
    if (w.GitBook && w.GitBook.registerAssistant) {
        w.GitBook.registerAssistant({
            label: 'RunLLM',
            icon: 'sparkle',
            ui: NATIVE_AI_EXPERIENCE === 'true',
            open: function (query) {
                const queryRunllm = () => {
                    w.runllm.open();
                    if (query) w.runllm.sendMessage(query);
                };

                if (w.runllm && typeof w.runllm.open === 'function') {
                    queryRunllm();
                } else {
                    const id = setInterval(() => {
                        if (w.runllm && typeof w.runllm.open === 'function') {
                            clearInterval(id);
                            queryRunllm();
                        }
                    }, 100);
                }
            },
        });
    }

    var l = function () {
        // Prevent duplicate script injection
        if (document.getElementById('runllm-widget-script')) return;

        var s = document.createElement('script');
        s.id = 'runllm-widget-script';
        s.src = 'https://widget.runllm.com';
        s.async = true;
        s.type = 'module';

        // Required
        setAttr(s, 'runllm-assistant-id', ASSISTANT_ID);

        // Optional
        setAttr(s, 'runllm-server-address', SERVER_ADDRESS);
        setAttr(s, 'runllm-name', NAME);
        setAttr(s, 'runllm-position', POSITION);
        setAttr(s, 'runllm-keyboard-shortcut', KEYBOARD_SHORTCUT);
        setAttr(s, 'runllm-theme-color', THEME_COLOR);
        setAttr(s, 'runllm-brand-logo', BRAND_LOGO);
        setAttr(s, 'runllm-community-url', COMMUNITY_URL);
        setAttr(s, 'runllm-community-type', COMMUNITY_TYPE);
        setAttr(s, 'runllm-disable-ask-a-person', DISABLE_ASK_A_PERSON);

        // Hide trigger button when embedding a native UI
        if (NATIVE_AI_EXPERIENCE === 'true') {
            s.setAttribute('runllm-hide-trigger-button', 'true');
        }

        // Wait for the widget script to finish loading
        s.addEventListener('load', function () {
            // Widget script loaded successfully
        });

        document.head.appendChild(s);
    };

    if (w.attachEvent) {
        w.attachEvent('onload', l);
    } else {
        w.addEventListener('load', l, false);
    }
})();
