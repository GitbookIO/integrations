/* eslint-disable no-console */
export const Logger = (namespace: string) => {
    return {
        info: (message: string, ...args: any) => {
            console.log(`[${namespace}] ${message}`, ...args);
        },
        debug: (message: string, ...args: any) => {
            console.debug(`[${namespace}] ${message}`, ...args);
        },
        error: (message: string, ...args: any) => {
            console.error(`[${namespace}] ${message}`, ...args);
        },
    };
};
