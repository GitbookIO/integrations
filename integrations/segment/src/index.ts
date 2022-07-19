import { generateSegmentTrackEvent } from "./events";

addEventListener('space_view', async (event) => {
    const writeKey = environment.spaceInstallation.configuration.write_key;
    if (!writeKey) {
        return;
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
