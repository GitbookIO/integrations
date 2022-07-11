import * as assert from 'assert';
import test from 'node:test';

import { runIsolatedEvent } from '../';

test('base64', async (t) => {
    await t.test('should base64 encode a string when calling btoa', async () => {
        const code = `
            const encoded = btoa('Hello world');
            console.log(encoded)
        `;

        const result = await runIsolatedEvent(code, { type: 'test' });

        assert.deepEqual(result.logs, [
            {
                level: 'info',
                message: '["SGVsbG8gd29ybGQ="]',
            },
        ]);
    });

    await t.test('should base64 decode a string when calling atob', async () => {
        const code = `
            const decoded = atob('SGVsbG8gd29ybGQ=');
            console.log(decoded)
        `;

        const result = await runIsolatedEvent(code, { type: 'test' });

        assert.deepEqual(result.logs, [
            {
                level: 'info',
                message: '["Hello world"]',
            },
        ]);
    });

    await t.test('should work both ways', async () => {
        const code = `
            const encoded = btoa('Hello world');
            const decoded = atob(encoded);
            console.log(decoded)
        `;

        const result = await runIsolatedEvent(code, { type: 'test' });

        assert.deepEqual(result.logs, [
            {
                level: 'info',
                message: '["Hello world"]',
            },
        ]);
    });
});