import * as api from '@gitbook/api';

import { buildScriptFromManifest } from './build';
import { createPublishBody } from './publish-body';
import { getAPIClient } from './remote';

/**
 * Publish the integration to GitBook.
 * If it already exists, it'll update it.
 */
export async function publishIntegration(
    specFilePath: string,
    updates: Partial<api.RequestPublishIntegration> = {},
): Promise<void> {
    const { manifest, script } = await buildScriptFromManifest(specFilePath);
    const body = await createPublishBody(specFilePath, manifest, script);
    const api = await getAPIClient(true);

    if (typeof body.target === 'string') {
        console.log(
            `ℹ️  Publishing integration with "${body.target}" as target for installations.`,
        );
    }

    const created = await api.integrations.publishIntegration(manifest.name, {
        ...body,
        ...updates,
    });
    console.log(`🚀 Integration "${created.data.name}" published`);
    console.log(`👉 ${created.data.urls.app}`);
}

/**
 * Delete an integration
 */
export async function unpublishIntegration(name: string): Promise<void> {
    const api = await getAPIClient(true);
    await api.integrations.unpublishIntegration(name);

    console.log(`👌 Integration "${name}" has been deleted`);
}
