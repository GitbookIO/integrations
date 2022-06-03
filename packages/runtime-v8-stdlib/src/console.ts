import * as bridge from './bridge';

export const console: Console = {
    // TODO: adding junk to conform to merged Console interface from node & lib.dom
    memory: undefined,
    markTimeline: undefined,
    // msIsIndependentlyComposed: undefined,
    // select: undefined,
    timeStamp: undefined,
    timeline: undefined,
    timelineEnd: undefined,
    Console: undefined,

    log(...args) {
        bridge._log('info', ...args);
    },
    info(...args) {
        bridge._log('info', ...args);
    },
    assert(assertion, ...args) {
        if (!assertion) {
            bridge._log('info', ...args);
        }
    },
    error(...args) {
        bridge._log('error', ...args);
    },
    exception(...args) {
        bridge._log('error', ...args);
    },
    warn(...args) {
        bridge._log('warn', ...args);
    },
    trace() {
        const stack = new Error().stack!.match(/[^\r\n]+/g);
        bridge._log('info', `Trace:\n${stack!.slice(2).join('\n')}`);
    },

    // off-spec
    debug(...args) {
        bridge._log('debug', ...args);
    },

    // unimplemented
    clear: noop,
    count: noop,
    countReset: noop,
    dir: noop,
    dirxml: noop,
    group: noop,
    groupCollapsed: noop,
    groupEnd: noop,
    // TODO: commenting out to resolve definition conflict between @types/node & lib.dom
    //  see: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/v4/index.d.ts#L15
    //  note: 'timestamp' here & 'timeStamp' above...
    // timestamp: noop,

    // TODO: Implement
    profile: noop,
    profileEnd: noop,
    table: noop,
    time: noop,
    timeLog: noop,
    timeEnd: noop,
};

function noop() {
    // noop
}
