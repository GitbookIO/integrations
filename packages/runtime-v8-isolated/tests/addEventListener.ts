import * as assert from 'assert';
import test from 'node:test';

import { runIsolatedEvent } from '../';

test('addEventListener', async (t) => {
    await t.test(
        'should return the returned value (primitive) of a sync listener callback',
        async () => {
            const code = `
            addEventListener('randomType', (event) => {
                return event.value + 1;
            });
            `;
            const result = await runIsolatedEvent(code, {
                type: 'randomType',
                value: 10,
            });

            assert.deepEqual(result, { logs: [], returnValue: 11 });
        }
    );

    await t.test(
        'should return the returned value (object) of a sync listener callback',
        async () => {
            const code = `
            addEventListener('randomType', (event) => {
                return { newValue: event.value + 1 };
            });
            `;
            const result = await runIsolatedEvent(code, {
                type: 'randomType',
                value: 10,
            });

            assert.deepEqual(result, { logs: [], returnValue: { newValue: 11 } });
        }
    );

    await t.test('should return the returned value of an async listener callback', async () => {
        const code = `
            addEventListener('randomType', async (event) => {
                return event.value + 1;
            });
            `;
        const result = await runIsolatedEvent(code, {
            type: 'randomType',
            value: 10,
        });

        assert.deepEqual(result, { logs: [], returnValue: 11 });
    });

    await t.test(
        'should return the returned value of an async listener callback (undefined)',
        async () => {
            const code = `
            addEventListener('randomType', async (event) => {
                // empty
            });
            `;
            const result = await runIsolatedEvent(code, {
                type: 'randomType',
                value: 10,
            });

            assert.deepEqual(result, { logs: [], returnValue: undefined });
        }
    );
});
