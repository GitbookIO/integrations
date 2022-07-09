import * as assert from 'assert';
import test from 'node:test';

import { runIsolatedEvent } from '../';

test('TextEncoding', async (t) => {
    await t.test('should correctly decode a buffer', async () => {
        const code = `
        const buffer = new Uint8Array([226, 130, 172]);
        console.log(new TextDecoder('utf-8').decode(buffer));
    `;

        const result = await runIsolatedEvent(code, { type: 'test' });

        assert.deepEqual(result.logs, [
            {
                level: 'info',
                message: '["€"]',
            },
        ]);
    });

    await t.test('should correctly encode a string', async () => {
        const code = `
        const buffer = new TextEncoder().encode("€");
        console.log(Array.from(buffer));
    `;

        const result = await runIsolatedEvent(code, { type: 'test' });

        assert.deepEqual(result.logs, [
            {
                level: 'info',
                message: '[[226,130,172]]',
            },
        ]);
    });

    await t.test('should work both ways', async () => {
        const code = `
        const input = 'Hello world!';

        const buffer = new TextEncoder().encode(input);
        const decoded = new TextDecoder().decode(buffer);

        console.log(decoded);
    `;

        const result = await runIsolatedEvent(code, { type: 'test' });

        assert.deepEqual(result.logs, [
            {
                level: 'info',
                message: '["Hello world!"]',
            },
        ]);
    });
});
