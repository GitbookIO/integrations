import * as assert from 'assert';
import test from 'node:test';

import { runIsolatedEvent } from '../';

test('environment', async (t) => {
    await t.test('should have access to global environment', async () => {
        const code = `
            console.log(environment.something)
        `;

        const result = await runIsolatedEvent(
            code,
            { type: 'test' },
            {
                something: 'hello',
            }
        );

        assert.deepEqual(result.logs, [
            {
                level: 'info',
                message: '["hello"]',
            },
        ]);
    });

    await t.test('should have access to global environment (nested properties)', async () => {
        const code = `
            console.log(environment.something.message)
        `;

        const result = await runIsolatedEvent(
            code,
            { type: 'test' },
            {
                something: {
                    message: 'hello',
                },
            }
        );

        assert.deepEqual(result.logs, [
            {
                level: 'info',
                message: '["hello"]',
            },
        ]);
    });
});
