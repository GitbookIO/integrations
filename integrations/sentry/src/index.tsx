/** @jsx contentKitHyperscript */

import * as api from '@gitbook/api';
import { createComponentCallback, contentKitHyperscript } from '@gitbook/runtime';

interface SentryIssueBlockState {
    sentryIssueId: string;
}

type SentryIssueBlockAction =
    | {
          action: '@link.unfurl';
          url: string;
      }
    | {
          action: 'resolve';
      };

createComponentCallback<SentryIssueBlockState, SentryIssueBlockAction>('sentry-issue', {
    action: async (previousState, action) => {
        switch (action.action) {
            case '@link.unfurl':
                return {
                    sentryIssueId: action.url.split('/').pop(),
                };

            case 'resolve':
                return previousState;

            default:
                return previousState;
        }
    },

    render: async (state) => {
        const issue = await getSentryIssueById(state.sentryIssueId);

        if (!issue) {
            return (
                <block>
                    <section>
                        <text>Sentry issue "{state.sentryIssueId}" not found.</text>
                    </section>
                </block>
            );
        }

        return (
            <block>
                <section>
                    <text />
                </section>
            </block>
        );
    },
});
