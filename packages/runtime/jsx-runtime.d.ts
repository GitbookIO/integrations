// eslint-disable-next-line import/no-internal-modules
import { jsx, jsxDEV, jsxs, Fragment } from './src/contentkit-jsx';

declare module '@gitbook/runtime/jsx-runtime' {
    export type jsx = typeof jsx;
    export type jsxs = typeof jsxs;
    export type jsxDEV = typeof jsxDEV;
    export type Fragment = typeof Fragment;
}
