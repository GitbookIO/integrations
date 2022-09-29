import { Api, HttpResponse } from './client';

export * from './client';

export const GITBOOK_DEFAULT_ENDPOINT = 'https://api.gitbook.com';

interface GitBookAPIErrorResponse {
    error: { code: number; message: string };
}

class GitBookAPIError extends Error {
    public statusCode: number;

    constructor(public response: HttpResponse<GitBookAPIErrorResponse, GitBookAPIErrorResponse>) {
        const errorData = response.data || response.error;
        const error = errorData.error || { code: 500, message: 'Unknown error' };
        super(error.message);
        this.statusCode = error.code;
    }
}

// @ts-ignore
const IS_CLOUDFLARE = typeof WebSocketPair !== 'undefined';

/*
 * Export the auto-generated API client under the name 'GitBookAPI'
 * and export all API types.
 */
export class GitBookAPI extends Api<{
    authToken?: string;
}> {
    private endpoint: string;

    constructor(
        options: {
            /**
             * API endpoint to use.
             * @default "https://api.gitbook.com"
             */
            endpoint?: string;

            /**
             * Authentication token to use.
             */
            authToken?: string;
        } = {}
    ) {
        const { endpoint = GITBOOK_DEFAULT_ENDPOINT, authToken } = options;

        super({
            baseUrl: `${endpoint}/v1`,
            securityWorker: (securityData) => {
                if (securityData.authToken) {
                    return {
                        headers: {
                            Authorization: `Bearer ${securityData.authToken}`,
                        },
                    };
                }

                return {};
            },
            customFetch: (input, init) => {
                // The current GitBook API has hard-coded the credentials and referrerPolicy
                // properties which are not supported by the version of fetch supported by CloudFlare.
                // Remove those properties here, but a future version of the GitBook API should make
                // this easier to configure.
                if (IS_CLOUDFLARE && 'credentials' in init) {
                    delete init.credentials;
                }

                if (IS_CLOUDFLARE && 'referrerPolicy' in init) {
                    delete init.referrerPolicy;
                }

                return fetch(input, init);
            },
        });

        this.endpoint = endpoint;

        const request = this.request;
        this.request = async (...args) => {
            try {
                const response = await request(...args);

                if (!response.ok) {
                    throw new GitBookAPIError(response);
                }

                return response;
            } catch (error) {
                if (error instanceof Error) {
                    throw error;
                }

                throw new GitBookAPIError(error);
            }
        };

        this.setSecurityData({ authToken });
    }

    /**
     * Create a new API client, authenticated as an installation.
     */
    public async createInstallationClient(
        integrationName: string,
        installationId: string
    ): Promise<GitBookAPI> {
        const { data: installationToken } =
            await this.integrations.createIntegrationInstallationToken(
                integrationName,
                installationId
            );

        return new GitBookAPI({
            endpoint: this.endpoint,
            authToken: installationToken.token,
        });
    }
}
