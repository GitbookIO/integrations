import * as assert from 'assert';
import test from 'node:test';

import { runIsolatedEvent } from '../';

test('Uint8Array', async (t) => {
    await t.test('should return the log (string)', async () => {
        const code = `
            const arr = new Uint8Array([1, 2, 3]);
            console.log(arr.length)
        `;

        const result = await runIsolatedEvent(code, { type: 'test' });

        assert.deepEqual(result.logs, [
            {
                level: 'info',
                message: '[3]',
            },
        ]);
    });
});
