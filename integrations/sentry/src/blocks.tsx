import { ContentKitBlock } from '@gitbook/api';
import { createComponent, ExposableError, Logger } from '@gitbook/runtime';

import * as sentry from './sentry';
import { SentryIssue, SentryRuntimeContext } from './types';
import { capitalizeFirstLetter, extractIssueIdFromURL } from './utils';

export const logger = Logger('integration:sentry');

/**
 * A generic block with a text and a link to the URL provided
 */
function defaultBlock(url: string | undefined, context: SentryRuntimeContext): ContentKitBlock {
    return (
        <block>
            <card
                title={'Sentry'}
                hint={url}
                onPress={url ? {
                    action: '@ui.url.open',
                    url,
                } : undefined}
                icon={
                    context.environment.integration.urls.icon ? <image
                        source={{
                            url: context.environment.integration.urls.icon,
                        }}
                        aspectRatio={1}
                    /> : undefined
                }
            />
        </block>
    );
}

/**
 * Component to render the block when embeding a Sentry URL.
 */
export const embedBlock = createComponent<{
    issueId?: string;
    url?: string;
}>({
    componentId: 'embed',

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;
                return {
                    props: {
                        issueId: extractIssueIdFromURL(url),
                        url,
                    },
                };
            }
        }

        return element;
    },

    async render(element, context) {
        const { issueId, url } = element.props;

        if (!issueId) {
            return defaultBlock(url, context);
        }

        let issueData: SentryIssue;
        try {
            issueData = await sentry.getIssue(issueId, context);
        } catch (err) {
            throw new ExposableError('Failed to fetch Sentry issue data');
        }

        const { title, shortId, level, metadata, status } = issueData;

        const hint = [
            <text>{shortId}</text>,
            <text> • </text>,
            <text>{capitalizeFirstLetter(level)}</text>,
            <text> • </text>,
            <text>{capitalizeFirstLetter(status)}</text>,
            <text> • </text>,
            <text>{metadata.function ?? metadata.type ?? metadata.value ?? ''}</text>,
        ];

        return (
            <block>
                <card
                    title={title}
                    hint={hint}
                    onPress={{
                        action: '@ui.url.open',
                        url,
                    }}
                    icon={
                        context.environment.integration.urls.icon ? <image
                            source={{
                                url: context.environment.integration.urls.icon,
                            }}
                            aspectRatio={1}
                        /> : undefined
                    }
                />
            </block>
        );
    },
});
