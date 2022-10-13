// eslint-disable-next-line import/no-internal-modules
import { jsx, jsxDEV, jsxs, Fragment } from './src/contentkit-jsx';

/**
 * This is a workaround for Typescript not supporting subpath exports in package.json
 * https://github.com/microsoft/TypeScript/issues/33079
 */

declare module '@gitbook/runtime/jsx-dev-runtime' {
    export type jsx = typeof jsx;
    export type jsxs = typeof jsxs;
    export type jsxDEV = typeof jsxDEV;
    export type Fragment = typeof Fragment;
}

declare namespace JSX {
    interface IntrinsicElements {
        block: any;
        button: any;
        box: any;
        vstack: any;
        hstack: any;
        spacer: any;
        divider: any;
        text: any;
        codeblock: any;
        markdown: any;
        webframe: any;
        textinput: any;
        card: any;
    }
}
