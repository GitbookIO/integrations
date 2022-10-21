import { createComponent } from '@gitbook/runtime';

import * as sentry from './api/sentry';

/**
 * Extract the parameters from a Figma URL.
 */
function extractIssueIdFromURL(input: string): string | undefined {
    const url = new URL(input);
    if (url.hostname !== 'sentry.io') {
        return;
    }

    const parts = url.pathname.split('/');
    return parts[4];
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Component to render the block when embeding a Figma URL.
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

        const { title, shortId, level, metadata, status } = await sentry.getIssue(issueId, context);

        const hint = [
            <text>{shortId}</text>,
            <text> • </text>,
            <text>{capitalizeFirstLetter(level)}</text>,
            <text> • </text>,
            <text>{capitalizeFirstLetter(status)}</text>,
            <text> • </text>,
            <text>{metadata.function}</text>,
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
    },
});
