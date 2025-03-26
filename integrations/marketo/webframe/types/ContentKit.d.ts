export {};

declare global {
    type ContentKitWebFrameAction =
        | '@editor.node.updateProps'
        | '@webframe.resize'
        | '@webframe.ready';

    type ContentKitWebFrameActionPayload = {
        action: ContentKitWebFrameAction;
        [key: string]: any;
    };
}
