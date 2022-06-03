import * as assert from 'assert';
import test from 'node:test';

import { runIsolatedEvent } from '../';

test('URL', async (t) => {
    await t.test('should have access to global URL', async () => {
        const code = `
        const url = new URL('https://example.com/foo?bar=baz');
        console.log(url.toString())
    `;

        const result = await runIsolatedEvent(code, { type: 'test' });

        assert.deepEqual(result.logs, [
            {
                level: 'info',
                message: '["https://example.com/foo?bar=baz"]',
            },
        ]);
    });
});
