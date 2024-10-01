/**
 * Error that are exposable to the end user in the GitBook UI.
 */
export class ExposableError extends Error {
    public code: number;

    constructor(message: string, code: number = 400) {
        super(message);
        this.name = 'ExposableError';
        this.code = code;
    }
}
