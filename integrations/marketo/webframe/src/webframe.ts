const gitbookWebFrame = window.parent;
const params = new URLSearchParams(window.location.search);
const formId = params.get('formId');
const munchkinId = params.get('munchkinId');

let cachedSize: { height: number } | undefined;

if (!formId) {
    throw new Error('missing formId parameter');
}

if (!munchkinId) {
    throw new Error('missing munchkinId parameter');
}

const elId = 'mktoForm_' + formId;

/**
 * Send an action message back to the GitBook ContentKit component.
 */
function sendAction(payload: ContentKitWebFrameActionPayload) {
    gitbookWebFrame?.postMessage({ action: payload }, '*');
}

/**
 * Recalculate the size of the element and send it to the parent.
 */
function recalculateSize() {
    const el = document.getElementById(elId);

    if (!el) {
        throw new Error("missing element with id '" + elId + "'");
    }

    const offsetHeight = el.offsetHeight;

    // Add a 2px buffer to the height to account for iframe chrome.
    const size = {
        height: typeof el.offsetHeight === 'number' ? el.offsetHeight + 2 : el.offsetHeight,
    };

    if (cachedSize && cachedSize.height === size.height) {
        // Don't send a resize if no change.
        return;
    }

    console.info('marketo-embed: recalculate size', size);
    cachedSize = size;
    sendAction({
        action: '@webframe.resize',
        size,
    });
}

const form = document.getElementById('mktoForm_pending');

if (!form) {
    throw new Error("missing element with id 'mktoForm_pending'");
}

form.id = elId;

window.MktoForms2.loadForm('//app-sj15.marketo.com', munchkinId, formId, () => {
    console.info('marketo-embed: form loaded');
    sendAction({
        action: '@webframe.ready',
    });

    recalculateSize();

    // Listen for any DOM changes and send the new size to the parent.
    // Marketo provides some utility functions to listen for form changes, but they don't work in every case.
    const observer = new MutationObserver(() => recalculateSize());
    observer.observe(form, { attributes: true, childList: true, subtree: true });
});
