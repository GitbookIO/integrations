import { FigmaRuntimeContext } from './types';

export interface FileNodeId {
    fileId: string;
    nodeId?: string;
}

// https://www.figma.com/developers/api#get-file-nodes-endpoint
interface FigmaAPIFile {
    name: string;
    thumbnailUrl: string;
}

// https://www.figma.com/developers/api#get-file-nodes-endpoint
interface FigmaAPINodes extends FigmaAPIFile {
    nodes: {
        [key: string]: {
            document?: {
                name?: string;
            };
        };
    };
}

// https://www.figma.com/developers/api#get-images-endpoint
interface FigmaAPIImages {
    images: {
        [key: string]: string;
    };
}

/**
 * Extract the parameters from a Figma URL.
 */
export function extractNodeFromURL(input: string): FileNodeId | undefined {
    // https://www.figma.com/file/<id>/...
    const url = new URL(input);
    if (url.hostname !== 'www.figma.com') {
        return;
    }

    const parts = url.pathname.split('/');
    if (parts[1] !== 'file') {
        return;
    }

    let nodeId: string | undefined;
    if (url.searchParams.has('node-id')) {
        // some times the node-id in the URL has a dash instead of a colon but the figma API returns response
        // of nodes-id(s) with a colon so we're adopting that format
        nodeId = url.searchParams.get('node-id').replaceAll('-', ':');
    }

    return { fileId: parts[2], nodeId };
}

/**
 * Fetch the informations about a Figma node.
 */
export async function fetchFigmaNode(fileId: string, nodeId: string, context: FigmaRuntimeContext) {
    try {
        const [node, image] = await Promise.all([
            fetchFigmaAPI<FigmaAPINodes>(
                `files/${fileId}/nodes`,
                { ids: nodeId, depth: 1 },
                context
            ),
            fetchFigmaImage(fileId, nodeId, context),
        ]);
        return {
            name: node.name,
            thumbnailUrl: node.thumbnailUrl,
            nodeName: node.nodes[nodeId]?.document?.name,
            nodeImage: image,
        };
    } catch (err) {
        return undefined;
    }
}

/**
 * Fetch the preview image for a node.
 */
export async function fetchFigmaImage(
    fileId: string,
    nodeId: string,
    context: FigmaRuntimeContext
) {
    try {
        const image = await fetchFigmaAPI<FigmaAPIImages>(
            `images/${fileId}`,
            { ids: nodeId, format: 'svg' },
            context
        );
        const imageUrl = image.images?.[nodeId];
        if (!imageUrl) {
            return undefined;
        }

        const response = await fetch(imageUrl);
        const svgText = await response.text();

        const [, width, height] = svgText.match(/viewBox="0 0 (\d+) (\d+)"/) || [];

        return {
            width: parseInt(width, 10),
            height: parseInt(height, 10),
            url: imageUrl,
        };
    } catch (err) {
        return undefined;
    }
}

/**
 * Fetch the informations about a Figma file.
 */
export async function fetchFigmaFile(fileId: string, context: FigmaRuntimeContext) {
    try {
        const response = await fetchFigmaAPI<FigmaAPIFile>(`files/${fileId}`, {}, context);
        return response;
    } catch (err) {
        return undefined;
    }
}

/**
 * Execute a Figma API request.
 */
export async function fetchFigmaAPI<T>(
    path: string,
    params: object,
    { environment }: FigmaRuntimeContext
): Promise<T> {
    const accessToken = environment.installation.configuration.oauth_credentials?.access_token;
    if (!accessToken) {
        throw new Error('Missing authentication');
    }

    const url = new URL(`https://api.figma.com/v1/${path}`);

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Figma API error: ${response.statusText}`);
    }

    return response.json();
}
