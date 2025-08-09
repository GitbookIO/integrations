declare module '*.raw.js' {
    const content: string;
    export default content;
}

// Allow local typechecking without installed workspace deps
declare module '@gitbook/runtime' {
    export type FetchPublishScriptEventCallback = any;
    export type RuntimeContext<T> = any;
    export type RuntimeEnvironment<A, B> = any;
    export function createIntegration<T>(...args: any[]): any;
}


