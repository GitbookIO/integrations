import { RuntimeEnvironment, RuntimeContext, OAuthConfig, RuntimeCallback } from '@gitbook/runtime';

export interface SentryInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
    };
}

export type SentryRuntimeEnvironment = RuntimeEnvironment<SentryInstallationConfiguration>;
export type SentryRuntimeContext = RuntimeContext<SentryRuntimeEnvironment>;

export type SentrySecretsConfig = Pick<OAuthConfig, 'clientId' | 'clientSecret'>;
export type RuntimeHandlerCallback = RuntimeCallback<[Request], Promise<Response>>;

export interface OAuthResponse {
    id: number;
    token: string;
    refreshToken: string;
    dateCreated: string;
    expiresAt: string;
    state: null;
    application: null;
}

export type SentryCredentials = Pick<
    OAuthResponse,
    'token' | 'refreshToken' | 'expiresAt' | 'dateCreated'
>;

export interface SentryOAuthCredentials {
    oauth_credentials: SentryCredentials;
}
