import * as fs from 'fs';
import * as path from 'path';

import * as api from '@gitbook/api';

import { buildScriptFromManifest } from './build';
import { resolveFile } from './manifest';
import { getAPIClient } from './remote';

/**
 * Publish the integration to GitBook.
 * If it already exists, it'll update it.
 */
export async function publishIntegration(
    specFilePath: string,
    updates: Partial<api.RequestPublishIntegration> = {},
): Promise<void> {
    const { name, body } = await prepareIntegrationPublish(specFilePath);
    const api = await getAPIClient(true);

    if (typeof body.target === 'string') {
        console.log(
            `ℹ️  Publishing integration with "${body.target}" as target for installations.`,
        );
    }

    const created = await api.integrations.publishIntegration(name, { ...body, ...updates });
    console.log(`🚀 Integration "${created.data.name}" published`);
    console.log(`👉 ${created.data.urls.app}`);
}

/** Builds the publish request while optionally preserving secret references for CI. */
export async function prepareIntegrationPublish(
    specFilePath: string,
    { resolveSecrets = true }: { resolveSecrets?: boolean } = {},
): Promise<{ name: string; body: api.RequestPublishIntegration }> {
    const { script, manifest } = await buildScriptFromManifest(specFilePath, {
        mode: 'production',
        resolveSecrets,
    });

    const body: api.RequestPublishIntegration = {
        runtime: 'v2',
        title: manifest.title,
        icon: manifest.icon
            ? await readImage(resolveFile(specFilePath, manifest.icon), 'icon')
            : undefined,
        description: manifest.description ?? '',
        summary: manifest.summary,
        scopes: manifest.scopes ?? [],
        categories: manifest.categories,
        blocks: manifest.blocks,
        contentSources: manifest.contentSources,
        configurations: manifest.configurations,
        secrets: manifest.secrets,
        visibility: manifest.visibility,
        target: manifest.target,
        organization: manifest.organization,
        externalLinks: manifest.externalLinks,
        previewImages: await Promise.all(
            (manifest.previewImages || []).map(async (imageFilePath) =>
                readImage(resolveFile(specFilePath, imageFilePath), 'preview'),
            ),
        ),
        contentSecurityPolicy: manifest.contentSecurityPolicy,
        script,
    };
    return { name: manifest.name, body };
}

/**
 * Delete an integration
 */
export async function unpublishIntegration(name: string): Promise<void> {
    const api = await getAPIClient(true);
    await api.integrations.unpublishIntegration(name);

    console.log(`👌 Integration "${name}" has been deleted`);
}

/**
 * Read and compile an icon.
 */
async function readImage(filePath: string, type: 'icon' | 'preview'): Promise<string> {
    const imageMaxSizes: {
        [key in typeof type]: number;
    } = {
        icon: 250 * 1024,
        preview: 1024 * 1024,
    };

    const sizeLimit = imageMaxSizes[type];

    if (path.extname(filePath) !== '.png') {
        throw new Error(
            `Invalid image file extension for ${filePath}. Only PNG files are accepted.`,
        );
    }

    const content = await fs.promises.readFile(filePath);
    if (content.length > sizeLimit) {
        throw new Error(
            `Image file ${filePath} is too large. Maximum size is ${sizeLimit / 1024}KB.`,
        );
    }

    return content.toString('base64');
}
