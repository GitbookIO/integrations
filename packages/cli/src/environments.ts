import { AsyncLocalStorage } from 'node:async_hooks';

export const DEFAULT_ENV = 'default';

const environmentStore = new AsyncLocalStorage<string | undefined>();

/**
 * Environment selected with `--env` for the command being run, set once before its action runs.
 * Lets commands that don't wrap themselves in `withEnvironment` (e.g. the generated API
 * commands) still honour the flag.
 */
let commandEnvironment: string | undefined;

/**
 * Get the current environment.
 */
export function getEnvironment() {
    return environmentStore.getStore() ?? commandEnvironment ?? DEFAULT_ENV;
}

/**
 * Set the environment for the rest of the process.
 */
export function setEnvironment(env: string | undefined) {
    commandEnvironment = env;
}

/**
 * Run a function with a specific environment.
 */
export function withEnvironment(env: string | undefined, fn: () => Promise<void>) {
    // Log to stderr so machine-readable output (`--json`/`--yaml`) on stdout stays parseable.
    console.error(
        `ℹ️  Running with CLI environment "${env ?? DEFAULT_ENV}", use "--env <env>" to change it`,
    );
    return environmentStore.run(env, fn);
}
