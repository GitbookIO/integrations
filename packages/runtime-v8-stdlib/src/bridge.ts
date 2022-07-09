import type * as ivmModule from 'isolated-vm';

declare function __log(level: 'debug' | 'info' | 'warn' | 'error', ...args: any[]): void;
declare const __ivm: typeof ivmModule;
declare function __addEventListener(
    type: string,
    eventHandler: (
        event: any,
        eventContext: any,
        callback: (err: string | undefined, result: any) => void
    ) => void
): void;
declare function __fetch(
    url: string,
    init: object,
    body: string | undefined,
    callback: (err: string | undefined, request: any, body: any) => void
): void;

declare function __encodeStringToBuffer(
    input: string
): Uint8Array;

declare function __decodeBufferToString(
    input: Uint8Array,
    encoding?: string
): string;

// Grab a reference to the ivm module and delete it from global scope. Now this closure is the
// only place in the context with a reference to the module. The `ivm` module is very powerful
// so you should not put it in the hands of untrusted code.
const _ivm = __ivm;
delete global.__ivm;

const _log = __log;
delete global.__log;

const _addEventListener = __addEventListener;
delete global.__addEventListener;

const _fetch = __fetch;
delete global.__fetch;

const _encodeStringToBuffer = __encodeStringToBuffer;
delete global.__encodeStringToBuffer;

const _decodeBufferToString = __decodeBufferToString;
delete global.__decodeBufferToString;

export { _ivm, _log, _addEventListener, _fetch, _encodeStringToBuffer, _decodeBufferToString };
