import * as api from '@gitbook/api';

function generateSegmentTrackEvent(event: api.SpaceViewEvent) {
    const { visitor } = event;

    return {
        anonymousId: visitor.anonymousId,
        event: 'gitbook.space.view',
        properties: {},
        context: {
            ip: visitor.ip,
        },
    };
}

export { generateSegmentTrackEvent };
