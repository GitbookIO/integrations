import { Router } from 'itty-router';

import { RequestUpdateIntegrationInstallation } from '@gitbook/api';
import {
    createComponent,
    createIntegration,
    createOAuthHandler,
    FetchEventCallback,
    getOAuthToken,
    OAuthConfiguration,
    OAuthResponse,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import { getJIRAIssue, getJIRASites } from './sdk';

interface Site {
    id: string;
    url: string;
    name: string;
    avatarUrl: string;
}

type IntegrationEnvironment = RuntimeEnvironment<{
    sites: Site[];
    oauth_credentials: OAuthConfiguration;
}>;

type IntegrationContext = RuntimeContext<IntegrationEnvironment>;

type Props = {
    url?: string;
};

const embedBlock = createComponent<Props, {}, {}, IntegrationContext>({
    componentId: 'embed',

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;

                return {
                    props: {
                        url,
                    },
                };
            }
        }

        return element;
    },

    async render(element, context) {
        element.setCache({ maxAge: 0 });

        const { url: urlStr } = element.props;
        const url = new URL(urlStr);
        const parts = url.pathname.split('/');
        const key = parts[parts.length - 1];

        if (!urlStr || !key) {
            return (
                <block>
                    <card title="Not Found">
                        <text>{urlStr}</text>
                    </card>
                </block>
            );
        }

        const { environment } = context;
        const configuration = environment.installation?.configuration;
        const site = configuration.sites.find((site) => url.toString().startsWith(site.url));

        if (!site) {
            // JIRA site not part of this installation
            return (
                <block>
                    <card title="No site found">
                        <text>No site found</text>
                    </card>
                </block>
            );
        }

        const accessToken = await getOAuthToken(
            configuration.oauth_credentials,
            {
                clientId: environment.secrets.CLIENT_ID,
                clientSecret: environment.secrets.CLIENT_SECRET,
                accessTokenURL: 'https://auth.atlassian.com/oauth/token',
                extractCredentials,
            },
            context,
        );

        const issue = await getJIRAIssue(key, {
            site: site.id,
            accessToken,
        });

        // Issue not found
        if (!issue) {
            return (
                <block>
                    <card title="Not Found">
                        <text>{urlStr}</text>
                    </card>
                </block>
            );
        }

        const hint = [
            <text>{issue.key}</text>,
            <text> • </text>,
            <text>{issue.fields.status.name}</text>,
            <text> • </text>,
            ...(issue.fields.assignee
                ? [
                      <image
                          source={{ url: issue.fields.assignee.avatarUrls['16x16'] }}
                          aspectRatio={1}
                      />,
                      <text>{issue.fields.assignee.displayName}</text>,
                  ]
                : [<text>Unassigned</text>]),
        ];

        return (
            <block>
                <card
                    title={issue.fields.summary}
                    hint={hint}
                    onPress={{
                        action: '@ui.url.open',
                        url,
                    }}
                    icon={{
                        type: 'image',
                        source: { url: issue.fields.issuetype.iconUrl },
                        aspectRatio: 1,
                    }}
                />
            </block>
        );
    },
});

const handleFetchEvent: FetchEventCallback<IntegrationContext> = async (request, context) => {
    const { environment } = context;

    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint,
        ).pathname,
    });

    /*
     * Authenticate the user using OAuth.
     */
    router.get(
        '/oauth',
        createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: environment.secrets.CLIENT_ID,
            clientSecret: environment.secrets.CLIENT_SECRET,
            authorizeURL: 'https://auth.atlassian.com/authorize?audience=api.atlassian.com',
            accessTokenURL: 'https://auth.atlassian.com/oauth/token',
            // offline_access needed for refresh tokens
            scopes: ['read:jira-work', 'read:jira-user', 'offline_access'],
            prompt: 'consent',
            extractCredentials,
        }),
    );

    const response = await router.handle(request, context);
    if (!response) {
        return new Response(`No route matching ${request.method} ${request.url}`, {
            status: 404,
        });
    }

    return response;
};

const extractCredentials = async (
    response: OAuthResponse,
): Promise<RequestUpdateIntegrationInstallation> => {
    const { access_token } = response;
    const sites = await getJIRASites(access_token);

    // Store the sites
    const serializedSites: Site[] = sites.map((site) => ({
        id: site.id,
        url: site.url,
        name: site.url,
        avatarUrl: site.avatarUrl,
    }));

    return {
        configuration: {
            oauth_credentials: {
                access_token,
                expires_at: Date.now() + response.expires_in * 1000,
                refresh_token: response.refresh_token,
            },
            sites: serializedSites,
        },
    };
};

export default createIntegration({
    fetch: handleFetchEvent,
    components: [embedBlock],
});
