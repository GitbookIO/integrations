import ora from 'ora';

import {
    getDefaultManifestPath,
    readIntegrationManifest,
    resolveIntegrationManifestPath,
} from './manifest';
import { getAPIClient } from './remote';

const intervalSeconds = 10;

/**
 * Print the logs of an integration.
 */
export async function tailLogs() {
    const spinner = ora({ color: 'blue' });
    const manifestSpecPath = await resolveIntegrationManifestPath(getDefaultManifestPath());
    const manifest = await readIntegrationManifest(manifestSpecPath);

    const api = await getAPIClient(true);
    const printed = new Set<string>();

    let scheduled: Timer | null = null;

    const printEvents = async () => {
        clearTimeout(scheduled!);
        spinner.start('Fetching events...');
        const { data: events } = await api.integrations.listIntegrationEvents(manifest.name, {
            limit: 2,
        });
        spinner.clear();

        const eventOldestToNewest = events.items.reverse();

        for (const event of eventOldestToNewest) {
            if (printed.has(event.id)) {
                return;
            }
            printed.add(event.id);

            spinner.start(`Fetching event ${event.id}...`);
            const {
                data: { trace },
            } = await api.integrations.getIntegrationEvent(manifest.name, event.id);
            spinner.clear();

            console.log('');
            console.log(
                `[${event.status}][${new Date(event.createdAt).toISOString()}] ${JSON.stringify(
                    event.payload,
                )}`,
            );

            if (trace?.logs.length === 0) {
                console.log('No logs');
            } else {
                trace?.logs.forEach((log) => {
                    console.log(`[${log.level}] ${log.message}`);
                });
            }
        }

        spinner.clear();
        spinner.start(`Waiting ${intervalSeconds}s for new events...`);

        clearTimeout(scheduled!);
        scheduled = setTimeout(() => {
            spinner.clear();
            printEvents();
        }, intervalSeconds * 1000);
    };

    printEvents();

    /**
     * Stop the process
     * killed (e.g. Ctrl/CMD+C)
     */
    process.on('SIGINT', async () => {
        spinner.start('Exiting...\n');
        clearTimeout(scheduled!);
        process.exit(0);
    });

    return new Promise(() => {});
}
