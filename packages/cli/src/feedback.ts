import { GitBookAPI } from '@gitbook/api';

import { config, getAuthConfig } from './config';
import { getEnvironment } from './environments';
import { USER_AGENT } from './remote';

/**
 * Published docs site collecting the feedback, per API endpoint.
 *
 * The site is chosen from the endpoint rather than a flag so a CLI pointed elsewhere can
 * never report into the production docs site. An endpoint that is not listed collects
 * nothing.
 */
const DOCS_SITE_URL_BY_API_HOST: Record<string, string> = {
    'api.gitbook.com': 'https://gitbook.com/docs',
};

/**
 * Refresh a cached token this long before it expires, so a submission started just under the
 * wire does not race the expiry.
 */
const EXPIRY_MARGIN_MS = 5 * 60 * 1000;

export interface FeedbackInput {
    category: string;
    summary: string;
    command?: string;
    flags?: string[];
    severity?: string;
    detail?: string;
    goal?: string;
    workaround?: string;
    model?: string;
    onDemand?: boolean;
}

/**
 * The recorded submission, as returned by the API.
 */
export interface FeedbackResult {
    id: string;
    result: string;
}

/**
 * Report feedback with a CLI command to GitBook's docs site.
 */
export async function reportFeedback(input: FeedbackInput): Promise<FeedbackResult> {
    const { endpoint } = getAuthConfig();
    const siteUrl = getDocsSiteURL(endpoint);
    if (!siteUrl) {
        throw new Error(
            `Feedback is not collected for the API endpoint "${endpoint}", so there is nowhere to send this report.`,
        );
    }

    const { token, organization, site } = await getContentAPIToken(endpoint, siteUrl);

    // Authenticated with the docs site's own content token, not the user's credentials: the
    // person running the CLI has no permission on the site collecting the feedback.
    const api = new GitBookAPI({
        userAgent: USER_AGENT,
        endpoint,
        authToken: token,
    });

    const response = await api.orgs.submitAgentFeedbackToSite(organization, site, {
        reportedBy: {
            ...(input.model ? { model: input.model } : {}),
            userAgent: USER_AGENT,
            ...(input.onDemand === undefined ? {} : { onDemand: input.onDemand }),
        },
        subject: input.command
            ? {
                  kind: 'cli-command',
                  command: input.command,
                  ...(input.flags?.length ? { flags: input.flags } : {}),
              }
            : { kind: 'generic' },
        feedback: {
            category: input.category,
            summary: input.summary,
            ...(input.severity ? { severity: input.severity } : {}),
            ...(input.detail ? { detail: input.detail } : {}),
            ...(input.goal ? { goal: input.goal } : {}),
            ...(input.workaround ? { workaround: input.workaround } : {}),
        },
    } as never);

    return {
        id: response.data?.id ?? '',
        result: response.data?.result ?? 'Thanks for your feedback.',
    };
}

/**
 * Build the report from a `--body` JSON object and the individual flags, with flags winning.
 *
 * Agents hand the whole report over as one JSON object; people reach for flags. Accepting
 * both means neither has to learn the other's shape.
 */
export function resolveFeedbackInput(body: unknown, flags: Partial<FeedbackInput>): FeedbackInput {
    if (body !== undefined && (typeof body !== 'object' || body === null || Array.isArray(body))) {
        throw new Error('--body must be a JSON object.');
    }

    const merged = {
        ...(body as Partial<FeedbackInput> | undefined),
        ...stripUndefined(flags),
    };

    const missing = (['category', 'summary'] as const).filter((key) => !merged[key]);
    if (missing.length > 0) {
        throw new Error(
            `Missing required field(s): ${missing.join(', ')}.\n` +
                '  as flags: --category <category> --summary <summary>\n' +
                `  or JSON:  --body '{"category":"usability","summary":"…"}'`,
        );
    }

    return merged as FeedbackInput;
}

function stripUndefined<T extends object>(value: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(value).filter(([, v]) => v !== undefined),
    ) as Partial<T>;
}

/**
 * The published docs site collecting feedback for an API endpoint, if any.
 */
export function getDocsSiteURL(endpoint: string): string | undefined {
    try {
        return DOCS_SITE_URL_BY_API_HOST[new URL(endpoint).host];
    } catch {
        return undefined;
    }
}

/**
 * Read the expiry of a content API token, which is a JWT.
 *
 * Only the payload is decoded, never verified: the value is used to decide when to ask for a
 * new token, and the API is the one that rejects an expired one.
 */
export function getTokenExpiry(token: string): number | undefined {
    const payload = token.split('.')[1];
    if (!payload) {
        return undefined;
    }

    try {
        const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        return typeof decoded?.exp === 'number' ? decoded.exp * 1000 : undefined;
    } catch {
        return undefined;
    }
}

/**
 * Whether a cached token is still usable, leaving a margin before its expiry.
 */
export function isTokenUsable(expiresAt: number | undefined, now: number = Date.now()): boolean {
    return typeof expiresAt === 'number' && expiresAt - EXPIRY_MARGIN_MS > now;
}

/**
 * A content API token for the docs site, reusing the cached one until it nears expiry.
 *
 * The token lives about a day, so resolving is rare; it is cached because resolving on every
 * report would be a wasted round trip, not because the call is expensive.
 */
async function getContentAPIToken(
    endpoint: string,
    siteUrl: string,
): Promise<{ token: string; organization: string; site: string }> {
    const env = getEnvironment();
    const cached = config.get(`envs.${env}.feedbackToken`) as
        | { token: string; organization: string; site: string; expiresAt?: number }
        | undefined;

    if (cached?.token && isTokenUsable(cached.expiresAt)) {
        return {
            token: cached.token,
            organization: cached.organization,
            site: cached.site,
        };
    }

    // Resolving a published URL needs no credentials, which is what lets the CLI report
    // feedback without the user being signed in.
    const api = new GitBookAPI({ userAgent: USER_AGENT, endpoint });
    const { data } = await api.urls.resolvePublishedContentByUrl({
        url: siteUrl,
    });

    if (!('apiToken' in data) || !data.apiToken || !('site' in data) || !data.site) {
        throw new Error(`Could not resolve the docs site at ${siteUrl} to report feedback to.`);
    }

    const resolved = {
        token: data.apiToken,
        organization: data.organization,
        site: data.site,
        expiresAt: getTokenExpiry(data.apiToken),
    };
    config.set(`envs.${env}.feedbackToken`, resolved);

    return {
        token: resolved.token,
        organization: resolved.organization,
        site: resolved.site,
    };
}
