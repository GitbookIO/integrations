import * as assert from 'assert';
import test from 'test';

import * as api from '@gitbook/api';

import { generateSegmentTrackEvent } from '../src/events';

const fakeSpaceViewEvent: api.SpaceViewEvent = {
    eventId: 'fake-event-id',
    type: 'space_view',
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
    url: 'https://docs.gitbook.com/integrations?utm_source=gitbook',
    referrer: 'https://www.gitbook.com/',
};

test('events', async (t) => {
    await t.test('should generate the Segment Track Event with expected properties', async () => {
        const expectedSegmentEvent = {
            event: '[GitBook] space_view',
            anonymousId: 'gitbookAnonymousId',
            context: {
                library: {
                    name: 'GitBook',
                    version: '0.0.0',
                },
                page: {
                    referrer: 'https://www.gitbook.com/',
                    path: '/integrations',
                    search: '?utm_source=gitbook',
                    url: 'https://docs.gitbook.com/integrations?utm_source=gitbook',
                },
                userAgent: 'fake-user-agent',
                ip: '127.0.0.1',
            },
            properties: {
                spaceId: 'fake-space-id',
                pageId: 'fake-page-id',
            },
        };
        const actualSegmentEvent = generateSegmentTrackEvent(fakeSpaceViewEvent);
        assert.deepEqual(expectedSegmentEvent, actualSegmentEvent);
    });

    await t.test(
        'should send the Segment ajs_anonymous_id cookie value as anonymousId when present',
        async () => {
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
            assert.equal(segmentEvent.anonymousId, 'segmentAnonymousId');
        }
    );

    await t.test(
        'should fallback to sending GitBook anonymousId value as anonymousId when ajs_anonymous_id is not present',
        async () => {
            const segmentEvent = generateSegmentTrackEvent(fakeSpaceViewEvent);
            assert.equal(segmentEvent.anonymousId, 'gitbookAnonymousId');
        }
    );
});
