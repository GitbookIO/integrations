import * as api from '@gitbook/api';

import { IntegrationInfo } from './metadata';

function generateSegmentTrackEvent(event: api.SpaceViewEvent, page: api.RevisionPageBase) {
    const { visitor, referrer, url, spaceId, pageId } = event;
    const visitedURL = new URL(url);

    return {
        event: 'gitbook.space.view',
        anonymousId: visitor.anonymousId,
        context: {
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
            userAgent: visitor.userAgent,
            ip: visitor.ip,
            cookies: visitor.cookies,
        },
        properties: {
            spaceId,
            pageId,
        },
    };
}

export { generateSegmentTrackEvent };
