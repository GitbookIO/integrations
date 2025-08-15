export interface GitBook {
    /**
     * Register a custom assistant for the GitBook site.
     * @returns A function to unregister the custom assistant.
     */
    registerCustomAssistant: (options: {
        /**
         * Label for the custom assistant
         */
        label: string;
        /**
         * Icon for the custom assistant.
         * @example robot
         *
         * Refer to `@gitbook/icons` for a complete list of icons.
         */
        icon: string;
        /**
         * Called when the custom assistant is opened.
         * @param query The query string to process.
         */
        onOpen: (query?: string) => void;
    }) => () => void;
}

declare global {
    interface Window {
        GitBook: GitBook;
    }
}
