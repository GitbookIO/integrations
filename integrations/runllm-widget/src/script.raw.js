(function () {
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

    document.head.appendChild(n);

    if (nativeAiExperience === 'true') {
        // Disable floating window
        // document.querySelector('.runllm-widget-container').style.display = 'none';

        // Register and open RunLLM Window from GitBook UI
        window.GitBook.registerCustomAssistant({
            label: 'RunLLM',
            icon: 'sparkle',
            onOpen: (query) => {
                // Open RunLLM window with query
            },
        });
    }
})();
