import * as assert from 'assert';
import test from 'node:test';

import { runIsolatedEvent } from '../';

test('fetch', async (t) => {
    await t.test('should be able to do HTTP request', async () => {
        const code = `
        addEventListener('test', async () => {
            const response = await fetch('https://api.gitbook.com');

            if (!response.ok) {
                throw new Error('HTTP request failed');
            }

            await response.text();

            return 'done'
        });
    `;

        const result = await runIsolatedEvent(code, { type: 'test' });

        assert.deepEqual(result, {
            logs: [],
            returnValue: 'done',
        });
    });

    await t.test('should accept headers and method', async () => {
        const code = `
        addEventListener('test', async () => {
            const response = await fetch('https://en8q7ngu5jojo.x.pipedream.net/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'John Doe',
                })
            });

            if (!response.ok) {
                throw new Error('HTTP request failed');
            }

            await response.text();

            return 'done'
        });
    `;

        const result = await runIsolatedEvent(code, { type: 'test' });

        assert.deepEqual(result, {
            logs: [],
            returnValue: 'done',
        });
    });
});
