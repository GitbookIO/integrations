import * as assert from 'assert';
import test from 'node:test';

import { runIsolatedEvent } from '../';

test('console', async (t) => {
    await t.test('should return the log (string)', async () => {
        const code = `
            console.log("hello")
        `;

        const result = await runIsolatedEvent(code, { type: 'test' });

        assert.deepEqual(result.logs, [
            {
                level: 'info',
                message: '["hello"]',
            },
        ]);
    });

    await t.test('should return the log (number)', async () => {
        const code = `
            console.log(1)
        `;

        const result = await runIsolatedEvent(code, { type: 'test' });

        assert.deepEqual(result.logs, [
            {
                level: 'info',
                message: '[1]',
            },
        ]);
    });

    await t.test('should return the log (object)', async () => {
        const code = `
            console.log({ a: 1 })
        `;

        const result = await runIsolatedEvent(code, { type: 'test' });

        assert.deepEqual(result.logs, [
            {
                level: 'info',
                message: '[{"a":1}]',
            },
        ]);
    });
});
