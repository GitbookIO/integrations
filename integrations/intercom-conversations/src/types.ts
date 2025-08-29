import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export type IntercomInstallationConfiguration = {
    /**
     * OAuth credentials.
     */
    oauth_credentials?: {
        access_token: string;
    };
};

export type IntercomRuntimeEnvironment = RuntimeEnvironment<IntercomInstallationConfiguration>;
export type IntercomRuntimeContext = RuntimeContext<IntercomRuntimeEnvironment>;

/**
 * Intercom API response types
 */
export interface IntercomApp {
    type: 'app';
    id_code: string;
    name: string;
    created_at: number;
    secure: boolean;
    identity_verification: boolean;
    timezone: string;
    region: string;
}

export interface IntercomMeResponse {
    type: 'admin';
    id: string;
    email: string;
    name: string;
    email_verified: boolean;
    app: IntercomApp;
    avatar?: {
        type: 'avatar';
        image_url: string;
    };
    has_inbox_seat: boolean;
}
