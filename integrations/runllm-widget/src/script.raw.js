(function () {
    const name = "<NAME>"
    const serverAddress = "<SERVER_ADDRESS>"
    const assistantID = "<ASSISTANT_ID>"
    const position = "<POSITION>"
    const keyboardShortcut = "<KEYBOARD_SHORTCUT>"
    const themeColor = "<THEME_COLOR>"
    const brandLogo = "<BRAND_LOGO>"
    const slackCommunityUrl = "<SLACK_COMMUNITY_URL>"
    const disableAskAPerson = "<DISABLE_ASK_A_PERSON>"

    n = document.createElement("script");
    n.id = "runllm-widget-script"
    n.src = "https://widget.runllm.com";
    n.async = true;
    n.type = "module"
    n.setAttribute('runllm-assistant-id', assistantID)
    if(serverAddress) {
        n.setAttribute('runllm-server-address', serverAddress)
    }
    if(name) {
        n.setAttribute('runllm-name', name)
    }
    if(position) {
        n.setAttribute('runllm-position', position)
    }
    if(keyboardShortcut) {
        n.setAttribute('runllm-keyboard-shortcut', keyboardShortcut)
    }
    if(themeColor) {
        n.setAttribute('runllm-theme-color', themeColor)
    }
    if(slackCommunityUrl) {
        n.setAttribute('runllm-slack-community-url', slackCommunityUrl)
    }
    if(disableAskAPerson) {
        n.setAttribute('runllm-disable-ask-a-person', disableAskAPerson)
    }
    if(brandLogo) {
        n.setAttribute('runllm-brand-logo', brandLogo)
    }


    document.head.appendChild(n);
})();