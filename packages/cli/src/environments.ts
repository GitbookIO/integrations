import { AsyncLocalStorage } from 'node:async_hooks';

export const DEFAULT_ENV = 'default';

const environmentStore = new AsyncLocalStorage<string>();

/**
 * Get the current environment.
 */
export function getEnvironment() {
    return environmentStore.getStore() ?? DEFAULT_ENV;
}

/**
 * Run a function with a specific environment.
 */
export function withEnvironment(env: string, fn: () => Promise<void>) {
    return environmentStore.run(env, fn);
}
