import { createIntegration, RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

import { generateSegmentTrackEvent } from './events';

type SegmentRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            write_key?: string;
        }
    >
>;

export default createIntegration<SegmentRuntimeContext>({
    events: {
        space_view: async (event, { environment }) => {
            const writeKey =
                environment.siteInstallation?.configuration?.write_key ??
                environment.spaceInstallation?.configuration?.write_key;
            if (!writeKey) {
                throw new Error(
                    `The Segment write key is missing from the Space (ID: ${event.spaceId}) installation.`,
                );
            }

            const trackEvent = generateSegmentTrackEvent(event);
            await fetch('https://api.segment.io/v1/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${btoa(`${writeKey}:`)}`,
                },
                body: JSON.stringify(trackEvent),
            });
        },
    },
});
