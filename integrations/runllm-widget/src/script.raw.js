(function () {
    var w = window;

    let a = w.runllm;
    if (!a) {
        let i = function () {
            i.c(arguments);
        };
        i.q = [];
        i.c = function (args) {
            i.q.push(args);
        };
        w.runllm = i;
    }

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

        document.head.appendChild(s);

        // Hide trigger button when embedding a native UI
        if (NATIVE_AI_EXPERIENCE === 'true') {
            s.setAttribute('runllm-hide-trigger-button', 'true');
        }

        w.GitBook.registerAssistant({
            label: 'RunLLM',
            icon: 'sparkle',
            ui: NATIVE_AI_EXPERIENCE === 'true',
            open: function (query) {
                if (w.runllm.open) {
                    w.runllm.open();
                    if (query) w.runllm.sendMessage(query);
                }
            },
        });
    };

    if (w.attachEvent) {
        w.attachEvent('onload', l);
    } else {
        w.addEventListener('load', l, false);
    }
})();
