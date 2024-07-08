// @ts-ignore - Ignore the error "'rootDir' is expected to contain all source files" because
// we need to control root to avoid ./dist/src and only have ./dist
import { name, version } from '../package.json';
import { Api } from './client';
import { GitBookAPIError } from './GitBookAPIError';

export * from './client';
export { GitBookAPIError };

export const GITBOOK_DEFAULT_ENDPOINT = 'https://api.gitbook.com';

interface GitBookAPIErrorResponse {
    error: { code: number; message: string };
}

/*
 * Export the auto-generated API client under the name 'GitBookAPI'
 * and export all API types.
 */
export class GitBookAPI extends Api<{
    authToken?: string;
}> {
    /**
     * Endpoint used by the API client.
     */
    public readonly endpoint: string;

    /**
     * Authentication token used by the API client.
     */
    public readonly authToken: string | undefined;

    /**
     * User agent used by the API client.
     */
    public readonly userAgent: string;

    constructor(
        options: {
            /**
             * API endpoint to use.
             * @default "https://api.gitbook.com"
             */
            endpoint?: string;

            /**
             * User agent to use.
             * It'll default to the package name and version.
             */
            userAgent?: string;

            /**
             * Authentication token to use.
             */
            authToken?: string;
        } = {}
    ) {
        const {
            endpoint = GITBOOK_DEFAULT_ENDPOINT,
            authToken,
            userAgent = `${name}/${version}`,
        } = options;

        super({
            baseUrl: `${endpoint}/v1`,
            securityWorker: (securityData) => {
                if (securityData.authToken) {
                    return {
                        headers: {
                            Authorization: `Bearer ${securityData.authToken}`,
                            'User-Agent': userAgent,
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
                if ('credentials' in init) {
                    delete init.credentials;
                }

                if ('referrerPolicy' in init) {
                    delete init.referrerPolicy;
                }

                const response = await fetch(input, init);

                if (!response.ok) {
                    let error: string = response.statusText;

                    try {
                        const body = (await response.json()) as GitBookAPIErrorResponse;
                        error = body?.error?.message || error;
                    } catch (err) {
                        // Ignore, just use the statusText as an error message
                    }

                    throw new GitBookAPIError(error, response);
                }
                return response;
            },
        });

        this.endpoint = endpoint;
        this.userAgent = userAgent;
        this.authToken = authToken;
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
            userAgent: this.userAgent,
            authToken: installationToken.token,
        });
    }
}
