declare module '*.raw.js' {
    const content: string;
    export default content;
}

export declare global {
    interface Window {
        GitBook: import('@gitbook/browser-types').GitBookGlobal;
    }
}
