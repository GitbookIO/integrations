(function () {
    var w = window;
    var d = document;

    let k = window.runllm;
    if (!k) {
        let i = function () {
            i.c(arguments);
        };
        i.q = [];
        i.c = function (args) {
            i.q.push(args);
        };
        window.runllm = i;
    }

    if (w.__RUNLLM_WIDGET_LOADED__) return;

    const name = '<NAME>';
    const serverAddress = '<SERVER_ADDRESS>';
    const assistantID = '<ASSISTANT_ID>';
    const position = '<POSITION>';
    const keyboardShortcut = '<KEYBOARD_SHORTCUT>';
    const themeColor = '<THEME_COLOR>';
    const brandLogo = '<BRAND_LOGO>';
    const communityUrl = '<COMMUNITY_URL>';
    const communityType = '<COMMUNITY_TYPE>';
    const disableAskAPerson = '<DISABLE_ASK_A_PERSON>';
    const nativeAiExperience = '<NATIVE_AI_EXPERIENCE>';

    var l = function () {
        n = document.createElement('script');
        n.id = 'runllm-widget-script';
        n.src = 'https://widget.runllm.com';
        n.async = true;
        n.type = 'module';
        n.setAttribute('runllm-assistant-id', assistantID);
        if (serverAddress) {
            n.setAttribute('runllm-server-address', serverAddress);
        }
        if (name) {
            n.setAttribute('runllm-name', name);
        }
        if (position) {
            n.setAttribute('runllm-position', position);
        }
        if (keyboardShortcut) {
            n.setAttribute('runllm-keyboard-shortcut', keyboardShortcut);
        }
        if (themeColor) {
            n.setAttribute('runllm-theme-color', themeColor);
        }
        if (communityUrl) {
            n.setAttribute('runllm-community-url', communityUrl);
        }
        if (communityType) {
            n.setAttribute('runllm-community-type', communityType);
        }
        if (disableAskAPerson) {
            n.setAttribute('runllm-disable-ask-a-person', disableAskAPerson);
        }
        if (brandLogo) {
            n.setAttribute('runllm-brand-logo', brandLogo);
        }
        if (nativeAiExperience === 'true') {
            // Disable floating window
            n.setAttribute('runllm-hide-trigger-button', true);
        }

        document.head.appendChild(n);

        w.__RUNLLM_WIDGET_LOADED__ = true;

        // Register and open RunLLM Window from GitBook UI
        window.GitBook.registerAssistant({
            label: 'RunLLM',
            icon: 'sparkle',
            ui: nativeAiExperience === 'true' ? true : false,
            open: (query) => {
                // Open RunLLM window with query
                window.runllm.open();
                window.runllm.sendMessage(query);
            },
        });
    };

    if (window.attachEvent) {
        window.attachEvent('onload', l);
    } else {
        window.addEventListener('load', l, false);
    }
})();
