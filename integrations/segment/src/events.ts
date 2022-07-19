import * as api from '@gitbook/api';

import { IntegrationInfo } from './metadata';

function generateSegmentTrackEvent(event: api.SpaceViewEvent) {
    const { visitor } = event;

    return {
        anonymousId: visitor.anonymousId,
        event: 'gitbook.space.view',
        context: {
            ip: visitor.ip,
            library: {
                name: IntegrationInfo.name,
                version: IntegrationInfo.version,
            },
        },
    };
}

export { generateSegmentTrackEvent };
