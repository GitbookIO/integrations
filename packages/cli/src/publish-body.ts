import { promises as fs } from 'node:fs';
import * as path from 'node:path';

import type * as api from '@gitbook/api';
import type { IntegrationManifest } from './manifest';

/** Serialize a reviewed manifest and its images without executing the integration script. */
export async function createPublishBody(
    specFilePath: string,
    manifest: IntegrationManifest,
    script: string,
): Promise<api.RequestPublishIntegration> {
    return {
        runtime: 'v2',
        title: manifest.title,
        icon: manifest.icon
            ? await readImage(path.resolve(path.dirname(specFilePath), manifest.icon), 'icon')
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
                readImage(path.resolve(path.dirname(specFilePath), imageFilePath), 'preview'),
            ),
        ),
        contentSecurityPolicy: manifest.contentSecurityPolicy,
        script,
    };
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

    const content = await fs.readFile(filePath);
    if (content.length > sizeLimit) {
        throw new Error(
            `Image file ${filePath} is too large. Maximum size is ${sizeLimit / 1024}KB.`,
        );
    }

    return content.toString('base64');
}
