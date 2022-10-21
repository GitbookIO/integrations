import { RuntimeEnvironment, RuntimeContext, OAuthConfig } from '@gitbook/runtime';

export interface SentryInstallationConfiguration {
    oauth_credentials?: {
        token: string;
        refreshToken: string;
        expiresAt: string;
    };
    sentryInstallationId?: string;
    sentryOrgSlug?: string;
}

export type SentryRuntimeEnvironment = RuntimeEnvironment<SentryInstallationConfiguration>;
export type SentryRuntimeContext = RuntimeContext<SentryRuntimeEnvironment>;

export type SentrySecretsConfig = Pick<OAuthConfig, 'clientId' | 'clientSecret'>;

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

export interface SentryIssue {
    title: string;
    shortId: string;
    level: string;
    metadata: { function: string };
    status: string;
}
