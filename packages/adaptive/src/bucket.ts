import type { BucketClient } from '@bucketco/browser-sdk';
import { writeGitBookVisitorCookie } from './utils';

/**
 * Sets a client-side session cookie with the features enabled in the bucket client.
 */
export function withBucket(client: BucketClient): () => void {
    const handler = () => {
        const features: Record<string, boolean> = {};
        // Check features enabled in the client
        for (const [key, value] of Object.entries(client.getFeatures())) {
            const enabled =
                typeof value.isEnabledOverride === 'boolean'
                    ? value.isEnabledOverride
                    : value.isEnabled;
            features[key] = enabled;
        }

        writeGitBookVisitorCookie('bucket', { bucket: features });
    };

    // Determine if we're in a browser environment
    const isBrowser = typeof window !== 'undefined';

    if (!isBrowser) {
        console.warn('withBucket was called in a non-browser environment');
        return () => {};
    }

    const cleanup: Array<() => void> = [];

    // Add event listener for when the DOM is ready
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        handler();
    } else {
        document.addEventListener('DOMContentLoaded', handler);
        cleanup.push(() => {
            document.removeEventListener('DOMContentLoaded', handler);
        });
    }
    // Add event listeners for feature updates
    cleanup.push(client.on('featuresUpdated', handler));

    // Return cleanup function
    return () => {
        cleanup.forEach((fn) => fn());
    };
}
