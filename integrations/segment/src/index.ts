import { createIntegration, RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

import { generateSegmentTrackEvent } from './events';

type SegmentRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            write_key?: string;
            eu_region?: boolean;
        }
    >
>;

export default createIntegration<SegmentRuntimeContext>({
    events: {
        site_view: async (event, { environment }) => {
            const writeKey = environment.siteInstallation?.configuration.write_key;
            const euRegion = environment.siteInstallation?.configuration.eu_region;

            const segmentEndpoint = euRegion
                ? 'https://events.eu1.segmentapis.com/v1/track'
                : 'https://api.segment.io/v1/track';

            if (!writeKey) {
                throw new Error(
                    `The Segment write key is missing from the Site (ID: ${event.siteId}) installation.`,
                );
            }

            const trackEvent = generateSegmentTrackEvent(event);
            await fetch(segmentEndpoint, {
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
