import * as assert from 'assert';
import test from 'node:test';

import { generateSegmentTrackEvent } from '../src/events';

test('events', async (t) => {
    await t.test('generate the Segment Track Event successfully', async () => {
        const expectedSegmentEvent = {
            anonymousId: 'anonymousId',
            event: 'gitbook.space.view',
            properties: {},
            context: {
                ip: '127.0.0.1',
            },
        };
        assert.deepEqual(
            generateSegmentTrackEvent({
                eventId: 'fake-event-id',
                type: 'space_view',
                spaceId: 'fake-space-id',
                pageId: 'fake-page-id',
                installationId: 'fake-installation-id',
                visitor: {
                    anonymousId: 'anonymousId',
                    userAgent: 'fake-user-agent',
                    ip: '127.0.0.1',
                    cookies: {
                        'fake-cookie': 'cookie',
                    },
                },
                url: 'https://docs.gitbook.com/integrations',
                referrer: 'https://www.gitbook.com/',
            }),
            expectedSegmentEvent
        );
    });
});
