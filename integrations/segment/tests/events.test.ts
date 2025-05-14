import { describe, it, expect } from 'bun:test';

import type * as api from '@gitbook/api';

import packageJson from '../package.json';
import { generateSegmentTrackEvent } from '../src/events';

const fakeSpaceViewEvent: api.SiteViewEvent = {
    eventId: 'fake-event-id',
    type: 'site_view',
    siteId: 'fake-site-id',
    spaceId: 'fake-space-id',
    pageId: 'fake-page-id',
    installationId: 'fake-installation-id',
    visitor: {
        anonymousId: 'gitbookAnonymousId',
        userAgent: 'fake-user-agent',
        ip: '127.0.0.1',
        cookies: {
            fake_cookie: 'cookie',
        },
    },
    url: 'https://gitbook.com/docs/integrations?utm_source=gitbook',
    referrer: 'https://www.gitbook.com/',
};

describe('events', () => {
    it('should generate the Segment Track Event with expected properties', () => {
        const expectedSegmentEvent = {
            event: '[GitBook] space_view',
            anonymousId: 'gitbookAnonymousId',
            context: {
                library: {
                    name: 'GitBook',
                    version: packageJson.version,
                },
                page: {
                    referrer: 'https://www.gitbook.com/',
                    path: '/docs/integrations',
                    search: '?utm_source=gitbook',
                    url: 'https://gitbook.com/docs/integrations?utm_source=gitbook',
                },
                userAgent: 'fake-user-agent',
                ip: '127.0.0.1',
            },
            properties: {
                siteId: 'fake-site-id',
                spaceId: 'fake-space-id',
                pageId: 'fake-page-id',
            },
        };
        const actualSegmentEvent = generateSegmentTrackEvent(fakeSpaceViewEvent);
        expect(expectedSegmentEvent).toMatchObject(actualSegmentEvent);
    });

    it('should send the Segment ajs_anonymous_id cookie value as anonymousId when present', () => {
        const { visitor, ...restSpaceViewEvent } = fakeSpaceViewEvent;
        const { cookies, ...restVisitor } = visitor;
        const segmentEvent = generateSegmentTrackEvent({
            ...restSpaceViewEvent,
            visitor: {
                ...restVisitor,
                cookies: {
                    ...cookies,
                    ajs_anonymous_id: 'segmentAnonymousId',
                },
            },
        });
        expect(segmentEvent.anonymousId).toEqual('segmentAnonymousId');
    });

    it('should fallback to sending GitBook anonymousId value as anonymousId when ajs_anonymous_id is not present', () => {
        const segmentEvent = generateSegmentTrackEvent(fakeSpaceViewEvent);
        expect(segmentEvent.anonymousId).toEqual('gitbookAnonymousId');
    });
});
