import * as assert from 'assert';
import test from 'node:test';

import { generateSegmentTrackEvent } from '../src/events';
import { IntegrationInfo } from '../src/metadata';

test('events', async (t) => {
    await t.test('generate the Segment Track Event successfully', async () => {
        const expectedSegmentEvent = {
            anonymousId: 'anonymousId',
            event: 'gitbook.space.view',
            context: {
                ip: '127.0.0.1',
                library: {
                    name: IntegrationInfo.name,
                    version: IntegrationInfo.version,
                },
                page: {
                    title: 'GitBook Integrations',
                    referrer: 'https://www.gitbook.com/',
                    path: '/integrations',
                    search: '?utm_source=gitbook',
                    url: 'https://docs.gitbook.com/integrations?utm_source=gitbook',
                },
            },
        };
        const actualSegmentEvent = generateSegmentTrackEvent(
            {
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
                url: 'https://docs.gitbook.com/integrations?utm_source=gitbook',
                referrer: 'https://www.gitbook.com/',
            },
            {
                id: 'fake-page-id',
                title: 'GitBook Integrations',
            }
        );
        assert.deepEqual(expectedSegmentEvent, actualSegmentEvent);
    });
});
