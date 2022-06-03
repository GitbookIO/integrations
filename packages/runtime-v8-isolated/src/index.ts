import ivm from 'isolated-vm';
import fetch from 'node-fetch';
import pMap from 'p-map';

import { stdlibCode } from '@gitbook/runtime-v8-stdlib';

export interface IsolatedLogEntry {
    level: 'debug' | 'info' | 'warn' | 'error';
    message: string;
}

export interface IsolatedExecutionResult {
    logs: IsolatedLogEntry[];
    error?: string;
    returnValue?: any;
}

export interface IsolatedMachine {
    /**
     * Max execution time in milliseconds
     */
    timeout: number;

    /**
     * Memory limit in MB.
     */
    memoryLimit: number;

    /**
     * Domain allowed for HTTP requests.
     * If not set, all domains are allowed.
     */
    networkAllowList: undefined | string[];
}

/**
 * Execute an event in a complete isolated environment.
 */
export async function runIsolatedEvent<EventType extends { type: string } = { type: string }>(
    code: string,
    event: EventType,
    eventEnvironment: any = {},
    machine: IsolatedMachine = { timeout: 10000, memoryLimit: 128, networkAllowList: undefined }
): Promise<IsolatedExecutionResult> {
    const result: IsolatedExecutionResult = {
        logs: [],
    };

    const listeners: Array<{
        type: string;
        listener: ivm.Reference;
    }> = [];

    const isolate = new ivm.Isolate({ memoryLimit: machine.memoryLimit });
    const context = isolate.createContextSync();
    const jail = context.global;

    context.global.setSync('global', jail.derefInto());

    // Isolates are ivm.Reference<Isolate> classes that work on both sides
    // of the bridge.
    jail.setSync('__ivm', ivm);

    jail.setSync('__log', (level, ...args) => {
        result.logs.push({
            level,
            message: JSON.stringify(args),
        });
    });

    jail.setSync(
        '__addEventListener',
        new ivm.Reference((type, listener) => {
            listeners.push({
                type,
                listener,
            });
        })
    );

    jail.setSync('environment', new ivm.ExternalCopy(eventEnvironment).copyInto({ release: true }));

    jail.setSync('__fetch', (url, request, body, callback) => {
        fetch(url, {
            method: request?.method,
            headers: request?.headers,
            body,
        }).then(
            async (res) => {
                callback.apply(undefined, [
                    undefined,
                    new ivm.ExternalCopy({
                        url: res.url,
                        status: res.status,
                        headers: { ...res.headers },
                    }),
                    await res.text(),
                ]);
            },
            (error) => {
                callback.apply(undefined, [(error.message, undefined, undefined)]);
            }
        );
    });

    const stdlibScript = isolate.compileScriptSync(stdlibCode);
    await stdlibScript.run(context, {
        timeout: machine.timeout,
    });

    try {
        const script = isolate.compileScriptSync(code);
        await script.run(context, {
            timeout: machine.timeout,
        });
    } catch (error) {
        result.error = error.message;
    }

    await pMap(listeners, async ({ type, listener }) => {
        if (type !== event.type) {
            return;
        }

        await new Promise<void>((resolve) => {
            // eslint-disable-next-line no-useless-call
            listener.apply(undefined, [
                new ivm.ExternalCopy(event).copyInto({ release: true }),
                new ivm.ExternalCopy(eventEnvironment).copyInto({ release: true }),
                new ivm.Callback((error, value) => {
                    if (error) {
                        result.error = error;
                    } else {
                        result.returnValue = value ? JSON.parse(value) : undefined;
                    }

                    resolve();
                }),
            ]);
        });
    });

    return result;
}
