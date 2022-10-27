const gitbookWebFrame = window.top;
const arcadeEmbedOrigin = 'https://demo.arcade.software';

let arcadeEmbed: HTMLIFrameElement;

console.info('arcade-embed: webframe initialize');

/**
 * Send an action message back to th e GitBook ContentKit component.
 */
function sendAction(payload: ContentKitWebFrameActionPayload) {
    gitbookWebFrame.postMessage({ action: payload }, '*');
}

/**
 * Handle the GitBook ContentKit component state update messages.
 */
function handleGitBookBlockStateUpdate(event) {
    if (!event.data) {
        return;
    }

    console.log('arcade-embed: handleGitBookBlockStateUpdate', event);

    const { flowId, currentStep } = event.data.state;

    if (!flowId) {
        console.error('arcade-embed: no flowId received. Arcade embed can not be rendered');
        return;
    }

    if (!arcadeEmbed) {
        const url = `${arcadeEmbedOrigin}/${flowId}?embed`;
        renderArcadeEmbed(url);
    }

    // Send message to Arcade embed to navigate to the selected step.
    if (currentStep) {
        const embedURL = arcadeEmbed.getAttribute('src');
        arcadeEmbed.contentWindow.postMessage(
            {
                event: 'navigate-to-step',
                stepId: currentStep,
            },
            embedURL
        );
    }
}

/**
 * Handle iframe resize events coming from the Arcade embed.
 */
function handleArcadeEmbedIframeResizeEvent(event) {
    const arcadeEmbedURL = arcadeEmbed ? arcadeEmbed.getAttribute('src') : undefined;

    // Discard iframe.resize event that may be coming from other Arcade embeds on the page
    if (event.origin !== arcadeEmbedURL) {
        return;
    }

    try {
        const parsed = JSON.parse(event.data);
        if (parsed.context === 'iframe.resize') {
            // Forward the iframe.resize event to GitBook ContentKit Webframe
            const arcadeContainer = document.getElementById('arcade-container');
            const height = parsed.height;
            const width = arcadeContainer.offsetWidth;
            const size = {
                aspectRatio: width / height,
                maxHeight: height,
            };
            sendAction({
                action: '@webframe.resize',
                size,
            });
        }
    } catch (err) {
        console.warn('arcade-embed: invalid iframe.resize message', event.data);
        return;
    }
}

/**
 * Handle the Arcade Embed remote state update events.
 */
function handleArcadeEmbedEvent(event) {
    console.log('arcade-embed: handleArcadeEmbedEvent', event);

    if (event.origin !== arcadeEmbedOrigin || !event.isTrusted) {
        return;
    }

    // Handle iframe resize events
    if (typeof event.data === 'string') {
        handleArcadeEmbedIframeResizeEvent(event);
        return;
    }

    if (event.data.event === 'arcade-state-update') {
        const arcade: Arcade = event.data.arcade;
        const { steps } = arcade;
        const [currentStep] = steps.filter((step) => step.isActive === true);

        const newProps = {
            steps: JSON.stringify(steps),
            currentStep: currentStep.id,
        };

        console.log('arcade-embed: updating block props', newProps);
        sendAction({
            action: '@editor.node.updateProps',
            props: newProps,
        });
    }
}

/**
 * Render the Arcade Embed.
 */
function renderArcadeEmbed(embedURL: string) {
    const container = document.querySelector('#arcade-container');
    arcadeEmbed = document.createElement('iframe');
    arcadeEmbed.id = 'arcade-embed';

    arcadeEmbed.setAttribute('webkitallowfullscreen', 'true');
    arcadeEmbed.setAttribute('mozallowfullscreen', 'true');
    arcadeEmbed.setAttribute('allowfullscreen', 'true');
    arcadeEmbed.setAttribute('frameborder', '0');
    arcadeEmbed.setAttribute('loading', 'lazy');
    arcadeEmbed.setAttribute('src', embedURL);

    container.appendChild(arcadeEmbed);

    console.info('arcade-embed: arcade iframe created');
}

window.addEventListener('message', (event) => {
    console.log('arcade-embed: message listener', event);
    if (event.origin === arcadeEmbedOrigin) {
        handleArcadeEmbedEvent(event);
    } else {
        handleGitBookBlockStateUpdate(event);
    }
});

console.log('arcade-embed: sending webframe.ready');
sendAction({
    action: '@webframe.ready',
});
