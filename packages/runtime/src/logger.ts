export const Logger = (namespace: string) => {
    return {
        info: (message: string, ...args: any) => {
            // eslint-disable-next-line no-console
            console.log(`[${namespace}] ${message}`, ...args);
        },
        debug: (message: string, ...args: any) => {
            // eslint-disable-next-line no-console
            console.debug(`[${namespace}] ${message}`, ...args);
        },
    };
};
