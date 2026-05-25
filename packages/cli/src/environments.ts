import { AsyncLocalStorage } from 'node:async_hooks';

export const DEFAULT_ENV = 'default';

const environmentStore = new AsyncLocalStorage<string | undefined>();

/**
 * Get the current environment.
 */
export function getEnvironment() {
    return environmentStore.getStore() ?? DEFAULT_ENV;
}

/**
 * Run a function with a specific environment.
 */
export function withEnvironment(env: string | undefined, fn: () => Promise<void>) {
    console.log(
        `ℹ️  Running with CLI environment "${env ?? DEFAULT_ENV}", use "--env <env>" to change it`,
    );
    return environmentStore.run(env, fn);
}
