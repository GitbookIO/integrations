import * as api from '@gitbook/api';

import { IntegrationInfo } from './metadata';

function generateSegmentTrackEvent(event: api.SpaceViewEvent, page: api.RevisionPageBase) {
    const { visitor, referrer, url } = event;
    const visitedURL = new URL(url);

    return {
        anonymousId: visitor.anonymousId,
        event: 'gitbook.space.view',
        context: {
            ip: visitor.ip,
            library: {
                name: IntegrationInfo.name,
                version: IntegrationInfo.version,
            },
            page: {
                title: page.title,
                path: visitedURL.pathname,
                search: visitedURL.search,
                url,
                referrer,
            },
        },
    };
}

export { generateSegmentTrackEvent };
