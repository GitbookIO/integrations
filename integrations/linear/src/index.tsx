import { ContentKitBlock, ContentKitIcon, ContentKitModal } from '@gitbook/api';
import { createIntegration, createComponent, createOAuthHandler, Logger } from '@gitbook/runtime';
import { extractLinearIssueIdFromLink, getLinearAPIClient } from './linear';
import { IssueQuery } from './linear/gql/graphql';
import { LinearRuntimeContext } from './types';

const logger = Logger('linear');

/**
 * Render a generic Linear issue card linking to the URL provided.
 */
function renderGenericCard(url: string, context: LinearRuntimeContext): ContentKitBlock {
    return (
        <block>
            <card
                title="Linear"
                hint={url}
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
            />
        </block>
    );
}

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
        const configuration = environment.installation?.configuration;

        if (!configuration || !('oauth_credentials' in configuration)) {
            return renderGenericCard(element.props.url, context);
        }

        const { issueId, url } = element.props;
        const linearClient = await getLinearAPIClient(configuration);

        let response: IssueQuery;
        try {
            response = await linearClient.issue({ id: issueId });
        } catch (error) {
            logger.info(
                `API Error when fetching the issue (ID: ${issueId})`,
                JSON.stringify(error)
            );
            // Fallback to displaying a generic card on error
            return renderGenericCard(element.props.url, context);
        }

        const { issue } = response;
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
                                      icon={ContentKitIcon.Maximize}
                                      tooltip="Show preview"
                                      onPress={{
                                          action: '@ui.modal.open',
                                          componentId: 'previewModal',
                                          props: {
                                              issueId,
                                              url,
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
 * Render a generic modal in case of errors.
 */
function renderGenericModal(url: string, context: LinearRuntimeContext): ContentKitModal {
    return (
        <modal title="Linear" size="fullscreen">
            <vstack>
                <hstack>
                    <text style="italic">{url}</text>
                    <button
                        icon={ContentKitIcon.LinkExternal}
                        onPress={{ action: '@ui.url.open', url }}
                    />
                </hstack>
                <divider />
                <text>
                    <text style="bold">Error: </text>
                    <text>Couldn't get the issue details.</text>
                </text>
            </vstack>
        </modal>
    );
}

/**
 * Component to render a preview of Linear issue when clicking maximize button.
 */
const previewModal = createComponent<{
    issueId: string;
    url: string;
}>({
    componentId: 'previewModal',

    async render(element, context) {
        const { environment } = context;
        const configuration = environment.installation?.configuration;

        if (!configuration || !('oauth_credentials' in configuration)) {
            return renderGenericModal(element.props.url, context);
        }

        const { issueId, url } = element.props;
        const linearClient = await getLinearAPIClient(configuration);

        let response: IssueQuery;
        try {
            response = await linearClient.issue({ id: issueId });
        } catch (error) {
            logger.info(
                `API Error when fetching the issue (ID: ${issueId})`,
                JSON.stringify(error)
            );
            return renderGenericModal(element.props.url, context);
        }

        const { issue } = response;
        return (
            <modal title={issue.title} size="fullscreen">
                <vstack>
                    <hstack>
                        <text>{issueId}</text>
                        <text> • </text>
                        <text>{issue.state.name}</text>
                        <text> • </text>
                        <text>{issue.assignee ? issue.assignee.name : 'Unassigned'}</text>
                    </hstack>
                    <divider />
                    <box>
                        <markdown content={issue.description ?? 'No description provided.'} />
                    </box>
                </vstack>
            </modal>
        );
    },
});

export default createIntegration<LinearRuntimeContext>({
    fetch: (request, context) => {
        const { environment } = context;
        const oauthHandler = createOAuthHandler({
            redirectURL: `${environment.integration.urls.publicEndpoint}/oauth`,
            clientId: environment.secrets.CLIENT_ID,
            clientSecret: environment.secrets.CLIENT_SECRET,
            authorizeURL: 'https://linear.app/oauth/authorize',
            accessTokenURL: 'https://api.linear.app/oauth/token',
        });

        return oauthHandler(request, context);
    },
    components: [embedBlock, previewModal],
});
