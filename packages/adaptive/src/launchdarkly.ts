import { writeGitBookVisitorCookie } from './utils';
import type { LDClient } from 'launchdarkly-js-client-sdk';

/**
 * Sets a client-side session cookie with the features enabled in the Launchdarkly client.
 */
export function withLaunchDarkly(client: LDClient): () => void {
    const handler = () => {
        const features: Record<string, boolean> = {};
        // Check features enabled in the client
        for (const [key, value] of Object.entries(client.allFlags())) {
            features[key] = value;
        }

        writeGitBookVisitorCookie('launchdarkly', { launchdarkly: features });
    };

    // Determine if we're in a browser environment
    const isBrowser = typeof window !== 'undefined';

    if (!isBrowser) {
        console.warn('withLaunchDarkly was called in a non-browser environment');
        return () => {};
    }

    // Always try to call handler immediately in case client is already initialized
    // This is safe even if the client isn't ready yet
    try {
        handler();
    } catch (error) {
        // Ignore errors if client isn't ready yet
        console.debug('LaunchDarkly client not ready yet, will wait for initialization');
    }

    const cleanup: Array<() => void> = [];

    const onReadyOrLoad = () => {
        client.on('initialized', handler);
        cleanup.push(() => {
            client.off('initialized', handler);
        });
    };

    // Add event listener for when the DOM is ready
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        onReadyOrLoad();
    } else {
        document.addEventListener('DOMContentLoaded', onReadyOrLoad);
        cleanup.push(() => {
            document.removeEventListener('DOMContentLoaded', onReadyOrLoad);
        });
    }

    // Add event listeners for feature updates
    client.on('change', handler);
    cleanup.push(() => {
        client.off('change', handler);
    });

    // Return cleanup function
    return () => {
        cleanup.forEach((fn) => fn());
    };
}
