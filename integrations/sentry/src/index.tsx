import { createComponent, createIntegration } from '@gitbook/runtime';
import {
    createOAuthHandler,
    createSentryOAuthCookieHandler,
    createWebhoookHandler,
    createSentryCookieHandler,
} from './sentry';
import { SentryRuntimeContext } from './types';
import { Router } from 'itty-router';

/**
 * Extract the parameters from a Figma URL.
 */
export function extractIssueFromURL(input: string): string | undefined {
    const url = new URL(input);
    if (url.hostname !== 'sentry.io') {
        return;
    }

    const parts = url.pathname.split('/');
    return parts[4];
}

/**
 * Component to render the block when embeding a Figma URL.
 */
const embedBlock = createComponent<{
    issue?: string;
    url?: string;
}>({
    componentId: 'embed',

    async action(element, action) {
        console.log('action', action);

        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;
                console.log('issue', extractIssueFromURL(url));
                return {
                    props: {
                        issue: extractIssueFromURL(url),
                        url,
                    },
                };
            }
        }

        return element;
    },

    async render(element, context) {
        const { issue } = element.props;
        console.log('issue in render', issue);
        const accessToken = context.environment.installation.configuration.oauth_credentials?.token;
        if (!accessToken) {
            throw Error('Missing authentication');
        }

        console.log('token in render', accessToken);
        const result = await fetch(`https://sentry.io/api/0/issues/${issue}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!result.ok) {
            throw Error('Failed to fetch Sentry issue');
        }

        console.log('result status', result.statusText, result.ok);

        const data = (await result.json()) as Record<any, any>;

        const {
            title,
            type,
            shortId,
            culprit,
            count,
            userCount,
            isUnhandled,
            firstSeen,
            lastSeen,
        } = data;

        const handled = isUnhandled ? 'Unhandled' : 'Handled';
        const eventCount = '500';
        const userCountStr = '500';

        return (
            <block>
                <box>
                    <vstack>
                        <box>
                            <text style="bold">{title}</text>
                        </box>
                    </vstack>
                </box>
            </block>
        );
    },
});

export default createIntegration<SentryRuntimeContext>({
    fetch: async (request, context) => {
        const { environment } = context;

        const router = Router({
            base: new URL(
                environment.spaceInstallation?.urls?.publicEndpoint ||
                    environment.installation?.urls.publicEndpoint ||
                    environment.integration.urls.publicEndpoint
            ).pathname,
        });

        // Auth router/routes
        /*
         * Authenticate the user using OAuth.
         */

        router.get('/oauth', createOAuthHandler());

        /*
         * Handles Sentry's webhook/redirect requests.
         * What request types are sent are configured in https://sentry.io/settings/gitbook/developer-settings/
         *
         * Integration install/uninstall events are supported by default.
         */
        router.get(
            '/webhook',
            createWebhoookHandler({
                clientId: environment.secrets.CLIENT_ID,
                clientSecret: environment.secrets.CLIENT_SECRET,
            })
        );

        router.post('/webhook', (req, { api, environment }) => {
            console.log('webhook post');
        });

        const response = await router.handle(request, context);
        if (!response) {
            return new Response(`No route matching ${request.method} ${request.url}`, {
                status: 404,
            });
        }

        return response;
    },

    components: [embedBlock],
});

{
    /* <hstack>
<box>
    <text>{culprit}</text>
</box>
<spacer />
<box>
    <text>{eventCount}</text>
</box>
<divider size="small" />
<box>
    <text>{userCountStr}</text>
</box>
</hstack>
<hstack>
<box>
    <text>{shortId}</text>
</box>
<spacer />
<box>
    <text style="italic">{firstSeen}</text>
</box>
<divider size="small" />
<box>
    <text style="italic">{lastSeen}</text>
</box>
</hstack> */
}
