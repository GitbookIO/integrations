/**
 * The error types returned by the Linear API
 */
export enum LinearErrorType {
    FeatureNotAccessible = 'FeatureNotAccessible',
    InvalidInput = 'InvalidInput',
    Ratelimited = 'Ratelimited',
    NetworkError = 'NetworkError',
    AuthenticationError = 'AuthenticationError',
    Forbidden = 'Forbidden',
    BootstrapError = 'BootstrapError',
    Unknown = 'Unknown',
    InternalError = 'InternalError',
    Other = 'Other',
    UserError = 'UserError',
    GraphqlError = 'GraphqlError',
    LockTimeout = 'LockTimeout',
}

/**
 * Error(s) returned by the Linear API.
 */
export interface LinearGraphQLError {
    /** The error type */
    message?: LinearErrorType;
    /** The path to the graphql node at which the error occured */
    path?: string[];
    extensions?: {
        /** The error type */
        type?: LinearErrorType;
        /** If caused by the user input */
        userError?: boolean;
        /** A friendly error message */
        userPresentableMessage?: string;
    };
}

/**
 * The raw response returned as a result of making a request to the Linear API.
 */
export interface LinearAPIResponse<Data> {
    /** The returned data */
    data?: Data;
    /** Any extensions returned by the Linear API */
    extensions?: unknown;
    /** Response headers */
    headers?: Headers;
    /** Response status */
    status?: number;
    /** An error message */
    error?: string;
    /** Any GraphQL errors returned by the Linear API */
    errors?: LinearGraphQLError[];
}

type Variables = Record<string, unknown>;

/**
 * Execute a RunKit API request.
 */
export async function fetchLinearGraphQL<LinearAPIData>(
    query: string,
    request: {
        method: string;
        variables: Variables;
    },
    oauthAccessToken: string
): Promise<LinearAPIResponse<LinearAPIData>> {
    const body = JSON.stringify({ query, variables: request.variables });

    const response = await fetch('https://api.linear.app/graphql', {
        method: request.method,
        body,
        headers: {
            Authorization: `Bearer ${oauthAccessToken}`,
            'Content-Type': 'application/json',
        },
    });

    const result = await getResult<LinearAPIData>(response);

    if (typeof result === 'string' || !response.ok || result.errors || !result.data) {
        const error = parseError<LinearAPIData>(
            typeof result === 'string' ? { error: result } : result
        );
        throw new Error(error);
    }

    return result;
}

/**
 * Parse the API resutl from the raw response.
 */
async function getResult<LinearAPIData>(
    response: Response
): Promise<LinearAPIResponse<LinearAPIData>> {
    const contentType = response.headers.get('Content-Type');

    if (contentType && contentType.startsWith('application/json')) {
        return response.json<LinearAPIResponse<LinearAPIData>>();
    }

    return response.text();
}

/**
 * Parses the error from the Linear API result.
 */
function parseError<LinearAPIData>(result: LinearAPIResponse<LinearAPIData>) {
    return result.errors?.[0]?.message ?? `Linear API Error (Code: ${result.status})`;
}
