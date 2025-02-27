/**
 * Asserts that the value is never.
 */
export function assertNever(value: never): never {
    throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}

/**
 * Asserts that a condition is true.
 */
export function assert(condition: any, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}
