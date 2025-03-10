const gitbookWebFrame = window.top;
const munchkinId = window.location.search.split('munchkinId=')[1].split('&')[0];
const formId = window.location.search.split('formId=')[1].split('&')[0];
const elId = 'mktoForm_' + formId;

const debounce = (callback: () => void, wait: number) => {
    let timeoutId: number | undefined = undefined;
    return () => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.call(null);
        }, wait);
    };
};

/**
 * Send an action message back to the GitBook ContentKit component.
 */
function sendAction(payload: ContentKitWebFrameActionPayload) {
    gitbookWebFrame?.postMessage({ action: payload }, '*');
}

const recalculateSize = debounce(() => {
    const el = document.getElementById(elId);

    if (!el) {
        throw new Error("missing element with id '" + elId + "'");
    }

    const size = { maxHeight: el.offsetHeight, maxWidth: el.offsetWidth, aspectRadio: 16 / 9 };
    console.info('marketo-embed: recalculate size', size);

    sendAction({
        action: '@webframe.resize',
        size,
    });
}, 10);

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

    const observer = new MutationObserver(() => recalculateSize());
    observer.observe(form, { attributes: true, childList: true, subtree: true });
});
