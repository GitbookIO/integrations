import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export type FirefliesInstallationConfiguration = {
    /**
     * Fireflies API key.
     */
    api_key?: string;
    /**
     * Fireflies webhook secret for verifying webhook signatures.
     */
    webhook_secret?: string;
};

export type FirefliesRuntimeEnvironment = RuntimeEnvironment<FirefliesInstallationConfiguration>;
export type FirefliesRuntimeContext = RuntimeContext<FirefliesRuntimeEnvironment>;

/**
 * Fireflies GraphQL API types
 */
export interface FirefliesSentence {
    index: number;
    speaker_name?: string;
    speaker_id?: string;
    text: string;
    raw_text?: string;
    start_time?: number;
    end_time?: number;
}

export interface FirefliesSpeaker {
    id: string;
    name: string;
}

export interface FirefliesTranscript {
    id: string;
    title: string;
    date: string;
    duration?: number;
    sentences?: FirefliesSentence[];
    speakers?: FirefliesSpeaker[];
    participants?: string[];
    host_email?: string;
    organizer_email?: string;
    transcript_url?: string;
    audio_url?: string;
    video_url?: string;
}

export interface FirefliesGraphQLResponse<T> {
    data?: {
        transcripts?: T[];
        transcript?: T;
    };
    errors?: Array<{
        message: string;
        extensions?: Record<string, unknown>;
    }>;
}

/**
 * Fireflies webhook payload structure.
 */
export interface FirefliesWebhookPayload {
    meetingId: string;
    eventType: string;
    clientReferenceId?: string;
}
