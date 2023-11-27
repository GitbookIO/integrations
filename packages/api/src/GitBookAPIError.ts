/**
 * Error thrown when the GitBook API returns an error.
 */
export class GitBookAPIError extends Error {
    /**
     * The response that caused the error.
     */
    public readonly response: Response;

    /**
     * Name of the error type.
     */
    public readonly name = 'GitBookAPIError';

    /**
     * The HTTP status code of the response.
     */
    public readonly code: number;

    constructor(errorMessage: string, response: Response) {
        const message = `GitBook API failed with [${response.status}] ${response.url}: ${errorMessage}`;

        super(message);
        this.response = response;
        this.code = response.status;
    }
}
