import pc from 'picocolors';

export const logger = {
    success(message: unknown) {
        emit('log', '✔', pc.green, message);
    },
    info(message: unknown) {
        emit('log', 'ℹ', pc.blue, message);
    },
    warn(message: unknown) {
        emit('warn', '⚠', pc.yellow, message);
    },
    error(message: unknown) {
        emit('error', '✖', pc.red, message);
    },
    debug(message: unknown) {
        emit('debug', 'DEBUG', pc.gray, message);
    },
};

const asString = (value: unknown) => {
    if (value instanceof Error) return value.message;
    return typeof value === 'string' ? value : JSON.stringify(value);
};

const emit = (
    stream: 'log' | 'error' | 'debug' | 'warn',
    label: string,
    color: (s: string) => string,
    message: unknown,
) => {
    console[stream](`${color(label)} ${asString(message)}\n`);
};
