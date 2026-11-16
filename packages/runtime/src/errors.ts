const INTEGRATION_ERRORS = {
    authentication_required: {
        status: 424,
        message:
            'The integration connection needs attention. Ask an administrator to reconnect the integration.',
    },
    configuration_required: {
        status: 424,
        message:
            'The integration configuration needs attention. Ask an administrator to review the integration settings.',
    },
    invalid_input: {
        status: 422,
        message: 'The integration rejected the input. Check the values and try again.',
    },
} as const;

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

/** Known, recoverable integration failures. Never include provider responses or credentials. */
export class IntegrationError extends ExposableError {
    public readonly reason: keyof typeof INTEGRATION_ERRORS;

    constructor(reason: keyof typeof INTEGRATION_ERRORS) {
        const { status, message } = INTEGRATION_ERRORS[reason];
        super(message, status);
        this.name = 'IntegrationError';
        this.reason = reason;
    }
}
