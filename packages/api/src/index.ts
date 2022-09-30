import { Api } from './client';

export * from './client';

export const GITBOOK_DEFAULT_ENDPOINT = 'https://api.gitbook.com';

interface GitBookAPIErrorResponse {
    error: { code: number; message: string };
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
            customFetch: async (input, init) => {
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

                // eslint-disable-next-line no-console
                console.log(`fetch ${input}`);
                const response = await fetch(input, init);

                if (!response.ok) {
                    let error: string = response.statusText;

                    try {
                        const body = (await response.json()) as GitBookAPIErrorResponse;
                        error = body?.error?.message || error;
                    } catch (err) {
                        // if it's a browser error, also log the headers to see if it can give us more info
                        response.headers.forEach((value, key) => {
                            error += `${key}:${value} `;
                        });

                        // Ignore, just use the statusText as an error message
                    }

                    throw new Error(
                        `GitBook API failed with [${response.status}] ${response.url}: ${error}`
                    );
                }
                // eslint-disable-next-line no-console
                console.log(`response ${response.status} ${response.statusText} ${input}`);
                return response;
            },
        });

        this.endpoint = endpoint;
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
