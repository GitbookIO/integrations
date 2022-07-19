import * as gitbook from '@gitbook/api';
import { api } from '@gitbook/runtime';

import { generateSegmentTrackEvent } from './events';

addEventListener('space_view', async (event: gitbook.SpaceViewEvent) => {
    const writeKey = environment.spaceInstallation.configuration.write_key;
    if (!writeKey) {
        return;
    }

    const { data: page } = await api.spaces.getPageById(event.spaceId, event.pageId);
    const trackEvent = generateSegmentTrackEvent(event, page);

    await fetch('https://api.segment.io/v1/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${btoa(`${writeKey}:`)}`,
        },
        body: JSON.stringify(trackEvent),
    });
});
