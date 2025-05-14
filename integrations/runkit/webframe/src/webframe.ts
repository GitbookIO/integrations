const gitbookWebFrame = window.parent;

let readOnly = false;
let runKitNotebook: NotebookEmbed | null = null;
let curProps: {
    content?: string;
    nodeVersion?: string;
} = {};

console.info('runkit-embed: webframe initialize');

/**
 * Send an action message back to the GitBook ContentKit component.
 */
function sendAction(payload: ContentKitWebFrameActionPayload) {
    gitbookWebFrame?.postMessage({ action: payload }, '*');
}

/**
 * Update the GitBook ContentKit component props.
 */
async function updateBlockProps(notebook: NotebookEmbed) {
    const content = await notebook.getSource();
    const nodeVersion = await notebook.getNodeVersion();
    const hasChanged = content !== curProps.content || nodeVersion !== curProps.nodeVersion;

    if (!content || !hasChanged) {
        return;
    }

    curProps = {
        content,
        nodeVersion,
    };
    sendAction({
        action: '@editor.node.updateProps',
        props: curProps,
    });
}

/**
 * Handle the GitBook ContentKit component state update messages.
 */
function handleBlockStateUpdate(event) {
    if (!event.data) {
        return;
    }

    const { content, nodeVersion, editable } = event.data.state;
    if (!runKitNotebook) {
        renderRunKitNoteBook(content, nodeVersion);
        return;
    }

    readOnly = !editable;

    if (content) {
        runKitNotebook.setSource(content);
    }

    if (nodeVersion) {
        runKitNotebook.setNodeVersion(nodeVersion);
    }
}

/**
 * Send periodic props update message once the RunKit Embed has loaded.
 */
function onRunKitNotebookLoaded(notebook: NotebookEmbed) {
    console.info('runkit-embed: runkit notebook loaded');
    if (!readOnly) {
        setInterval(updateBlockProps, 1000, notebook);
    }
}

/**
 * Update the GitBook ContentKit WebFrame size when the RunKit Embed changes its size.
 */
function updateWebFrameSize(notebook: NotebookEmbed, { height }) {
    const notebookContainer = document.getElementById('notebook');
    const size = {
        aspectRatio: notebookContainer.offsetWidth / height,
        height,
    };
    sendAction({
        action: '@webframe.resize',
        size,
    });
}

/**
 * Render the RunKit Embed.
 */
function renderRunKitNoteBook(content?: string, nodeVersion?: semverRange) {
    runKitNotebook = window.RunKit.createNotebook({
        element: document.getElementById('notebook'),
        source: content || '',
        nodeVersion,
        onLoad: onRunKitNotebookLoaded,
        onResize: updateWebFrameSize,
    });
    console.info('runkit-embed: runkit notebook created');
}

window.addEventListener('message', (event) => {
    if (event.origin !== 'https://runkit.com') {
        handleBlockStateUpdate(event);
    }
});

sendAction({
    action: '@webframe.ready',
});
