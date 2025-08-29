import { ContentKitBlock, ContentKitIcon, ContentKitModal } from '@gitbook/api';
import { createIntegration, createComponent, createOAuthHandler, Logger } from '@gitbook/runtime';
import { extractLinearIssueIdFromLink, getLinearAPIClient } from './linear';
import { IssueQuery } from './linear/gql/graphql';
import { LinearRuntimeContext } from './types';

const logger = Logger('linear');

/**
 * Render a generic Linear issue card linking to the URL provided.
 */
function renderGenericCard(
    url: string | undefined,
    context: LinearRuntimeContext,
): ContentKitBlock {
    return (
        <block>
            <card
                title="Linear"
                hint={url}
                onPress={
                    url
                        ? {
                              action: '@ui.url.open',
                              url,
                          }
                        : undefined
                }
                icon={
                    context.environment.integration.urls.icon ? (
                        <image
                            source={{
                                url: context.environment.integration.urls.icon,
                            }}
                            aspectRatio={1}
                        />
                    ) : undefined
                }
            />
        </block>
    );
}

/**
 * Get the issue icons based on the issue details.
 */
function getIssueIconsURLs(
    context: LinearRuntimeContext,
    issueQueryResponse: IssueQuery,
    theme: string,
) {
    const { issue } = issueQueryResponse;
    const { state, priorityLabel: priority } = issue;

    const assetsBaseURL = context.environment.integration.urls.assets;
    const statusIconURL = new URL(`${assetsBaseURL}/status/${state.type}`);
    if (state.type !== 'unstarted') {
        statusIconURL.searchParams.set('fill', state.color.replace('#', ''));
    }
    if (['completed', 'unstarted'].includes(state.type)) {
        statusIconURL.searchParams.set('stroke', state.color.replace('#', ''));
    }
    statusIconURL.searchParams.set('theme', theme);

    const priorityIcon = `priority-${priority
        .toLocaleLowerCase()
        .replaceAll(' ', '-')}-${theme}.svg`;

    return {
        status: statusIconURL.toString(),
        priority: `${assetsBaseURL}/${priorityIcon}`,
        assignee:
            issue.assignee && issue.assignee.avatarUrl
                ? issue.assignee.avatarUrl
                : `${assetsBaseURL}/unassigned-${theme}.svg`,
    };
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
        const { issueId, url } = element.props;

        if (!configuration || !('oauth_credentials' in configuration) || !url || !issueId) {
            return renderGenericCard(url, context);
        }

        const linearClient = await getLinearAPIClient(configuration);

        let response: IssueQuery;
        try {
            response = await linearClient.issue({ id: issueId });
        } catch (error) {
            logger.info(
                `API Error when fetching the issue (ID: ${issueId})`,
                JSON.stringify(error),
            );
            // Fallback to displaying a generic card on error
            return renderGenericCard(element.props.url, context);
        }

        const icons = getIssueIconsURLs(context, response, element.context.theme);

        const { issue } = response;
        const hint = [
            <image source={{ url: icons.priority }} aspectRatio={1} />,
            <text>{issueId}</text>,
            <text>•</text>,
            <image source={{ url: icons.status }} aspectRatio={1} />,
            <text>{issue.state.name}</text>,
        ];

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
                        context.environment.integration.urls.icon ? (
                            <image
                                source={{
                                    url: context.environment.integration.urls.icon,
                                }}
                                aspectRatio={1}
                            />
                        ) : undefined
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
        <modal title="Linear" size="xlarge">
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
                JSON.stringify(error),
            );
            return renderGenericModal(element.props.url, context);
        }

        const icons = getIssueIconsURLs(context, response, element.context.theme);
        const { issue } = response;

        const subtitle = [
            <image source={{ url: icons.priority }} aspectRatio={1} />,
            <text>{issueId}</text>,
            <text>•</text>,
            <image source={{ url: icons.status }} aspectRatio={1} />,
            <text>{issue.state.name}</text>,
            <text>•</text>,
            <image source={{ url: icons.assignee }} aspectRatio={1} />,
            <text>
                {issue.assignee ? `Assigned to ${issue.assignee.displayName}` : 'Unassigned'}
            </text>,
        ];

        return (
            <modal title={issue.title} subtitle={subtitle} size="xlarge">
                <vstack>
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
