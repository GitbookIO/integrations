/**
 * Asserts that the value is never.
 */
export function assertNever(value: never): never {
    throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}
