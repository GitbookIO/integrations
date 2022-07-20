import * as api from '@gitbook/api';

import { generateSegmentTrackEvent } from './events';

addEventListener('space_view', async (event: api.SpaceViewEvent) => {
    const writeKey = environment.spaceInstallation.configuration.write_key;
    if (!writeKey) {
        throw new Error(
            `The Segment write key is missing from the Space (ID: ${event.spaceId}) installation.`
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
});
