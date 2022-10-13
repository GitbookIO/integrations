import { createIntegration, createComponent, createOAuthHandler } from '@gitbook/runtime';
import { extractLinearIssueIdFromLink, getLinearAPIClient } from './linear';
import { LinearRuntimeContext } from './types';

/**
 * Component to render the block when embeding a Linear issue URL.
 */
const embedBlock = createComponent<{
    url?: string;
    issueId?: string;
}>({
    componentId: 'embed',

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;
                const issueId = extractLinearIssueIdFromLink(url);

                return {
                    props: {
                        url,
                        issueId,
                    },
                };
            }
        }

        return element;
    },

    async render(element, context) {
        const { environment } = context;
        const { installation } = environment;

        if (!installation) {
            return;
        }

        const { issueId, url } = element.props;

        const linearClient = await getLinearAPIClient(installation.configuration);
        const { issue } = await linearClient.issue({ id: issueId });
        // TODO: add images with Linear icons once we've added build script to publish public assets to Cloudflare
        const hint = [<text>{issueId}</text>, <text> • </text>, <text>{issue.state.name}</text>];

        return (
            <block>
                <card
                    title={issue.title}
                    hint={hint}
                    onPress={{
                        action: '@ui.url.open',
                        url,
                    }}
                    icon={
                        <image
                            source={{
                                url: context.environment.integration.urls.icon,
                            }}
                            aspectRatio={1}
                        />
                    }
                    buttons={
                        issue.description
                            ? [
                                  <button
                                      icon="maximize"
                                      tooltip="Show preview"
                                      onPress={{
                                          action: '@ui.modal.open',
                                          componentId: 'previewModal',
                                          props: {
                                              id: issueId,
                                              title: issue.title,
                                              description: issue.description,
                                              assignee: issue.assignee
                                                  ? {
                                                        name: issue.assignee.name,
                                                        avatarUrl: issue.assignee.avatarUrl,
                                                    }
                                                  : undefined,
                                              state: issue.state.name,
                                          },
                                      }}
                                  />,
                              ]
                            : []
                    }
                />
            </block>
        );
    },
});

/**
 * Component to render a preview of Linear issue when clicking maximize button.
 */
const previewModal = createComponent<{
    id: string;
    title: string;
    description?: string;
    assignee?: {
        name: string;
        avatarUrl?: string;
    };
    state: string;
}>({
    componentId: 'previewModal',

    async render(element, context) {
        const { id, title, description, state, assignee } = element.props;

        return (
            <modal title={title} size="fullscreen">
                <vstack>
                    <hstack align="center">
                        <text>{id}</text>
                        <text>{state}</text>
                        {assignee ? (
                            <>
                                {assignee.avatarUrl ? (
                                    <image
                                        source={{
                                            url: assignee.avatarUrl,
                                        }}
                                        aspectRatio={4}
                                    />
                                ) : null}
                                <text>{assignee.name}</text>
                            </>
                        ) : null}
                    </hstack>
                    <divider />
                    <box>
                        <markdown content={description ?? 'No description provided.'} />
                    </box>
                </vstack>
            </modal>
        );
    },
});

export default createIntegration<LinearRuntimeContext>({
    fetch: (request, context) => {
        const oauthHandler = createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: environment.secrets.CLIENT_ID,
            clientSecret: environment.secrets.CLIENT_SECRET,
            authorizeURL: 'https://linear.app/oauth/authorize',
            accessTokenURL: 'https://api.linear.app/oauth/token',
        });

        return oauthHandler(request, context);
    },
    components: [embedBlock, previewModal],
});
