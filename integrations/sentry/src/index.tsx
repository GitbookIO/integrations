import { createComponent, createIntegration, Logger } from '@gitbook/runtime';
import { SentryRuntimeContext } from './types';

/**
 * Extract the parameters from a Figma URL.
 */
export function extractIssueFromURL(input: string): string | undefined {
    // https://www.figma.com/file/<id>/...
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
        // const { issue, url } = element.props;
        const issue = '3456959231';
        const authToken = '6bca993e06c4407f85f6669310eaedb81f47c8486f314cd6885155b1e752e85d';
        const result = await fetch(`https://sentry.io/api/0/issues/${issue}/`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        const data = await result.json();

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
        const eventCount = count.toString();
        const userCountStr = userCount.toString();

        return (
            <block>
                <box style="card">
                    <vstack>
                        <box>
                            <text style="bold">{title}</text>
                        </box>
                        <hstack>
                            <box>
                                <text>{culprit}</text>
                            </box>
                            <spacer />
                            <box>
                                <text>{eventCount}</text>
                            </box>
                            <divider size="small" style="line" />
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
                            <divider size="small" style="line" />
                            <box>
                                <text style="italic">{lastSeen}</text>
                            </box>
                        </hstack>
                    </vstack>
                </box>
            </block>
        );
    },
});

export default createIntegration<SentryRuntimeContext>({
    events: {},
    components: [embedBlock],
});
