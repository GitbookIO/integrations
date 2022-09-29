/**
 * Return the HTML for the webframe that renders the RunKit widget.
 */
export function getWebFrameHTML(readOnly: boolean = false) {
    const gitbookAppOrigins = [
        'https://getsquad-dev-steeve.firebaseapp.com',
        'http://localhost:5000',
    ];
    return `
<html>
<style>
* { margin: 0; padding: 0; }
</style>
<body>
    <div id="notebook"></div>
    <script src="https://embed.runkit.com"></script>
    <script>
    const gitbookWebFrame = window.top;
    const GITBOOK_APP_ORIGINS = ${JSON.stringify(gitbookAppOrigins)};
    let runKitNotebook = null;
    let curContent = null;

    console.info('runkit-embed: webframe initialize');
    
    function sendAction(action) {
        gitbookWebFrame.postMessage({ action }, '*');
    }

    async function updateBlockProps(notebook) {
        const content = await notebook.getSource();
        const nodeVersion = await notebook.getNodeVersion();

        if (!content || content === curContent) {
            return;
        }

        curContent = content;
        sendAction({
            action: '@editor.node.updateProps',
            props: {
                content,
                nodeVersion,
            },
        });
    }

    function onRunKitNotebookLoaded(notebook) {
        console.info('runkit-embed: runkit iframe loaded');
        ${!readOnly ? 'setInterval(updateBlockProps, 1000, notebook)' : ''};
    }
    
    function handleStateUpdate(event) {
        if (!event.data) {
            return;
        }
    
        const { content, nodeVersion }  = event.data.state;
        if (!runKitNotebook) {
            renderRunKitNoteBook(content, nodeVersion);
            return;
        }

        if (content) {
            runKitNotebook.setSource(content);
        }

        if (nodeVersion) {
            runKitNotebook.setNodeVersion(nodeVersion);
        }
    }
    
    function updateWebFrameSize(notebook, { height }) {
        const notebookContainer = document.getElementById('notebook');
        const size = {
            aspectRatio: notebookContainer.offsetWidth / height,
            maxHeight: height,
        };
        sendAction({
            action: '@webframe.resize',
            size
        });
    }
    
    window.addEventListener('message', (event) => {
        if (GITBOOK_APP_ORIGINS.includes(event.origin)) {
            handleStateUpdate(event);
        }
    });
    
    function renderRunKitNoteBook(content, nodeVersion) {
        runKitNotebook = window.RunKit.createNotebook({
            element: document.getElementById('notebook'),
            source: content,
            nodeVersion: nodeVersion,
            onLoad: onRunKitNotebookLoaded,
            onResize: updateWebFrameSize
        });
    }

    sendAction({
        action: '@webframe.ready',
    });
    
    </script>
</body>
</html>
`;
}
