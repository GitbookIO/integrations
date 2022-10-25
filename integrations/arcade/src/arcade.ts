export interface ArcadeOEmbed {
    type: 'rich';
    title: string;
    width: number;
    height: number;
}

/**
 * Fetch the Arcade oembed data.
 */
export async function fetchArcadeOEmbedData(flowId: string): Promise<ArcadeOEmbed> {
    const url = new URL(`https://app.arcade.software/api/oembed`);
    url.searchParams.append('url', `https://app.arcade.software/share/${flowId}`);

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const result = await response.json<ArcadeOEmbed>();

    return result;
}

/**
 * Extract the Arcade flow ID from the embed URL.
 */
export function extractArcadeFlowFromURL(input: string): {
    flowId?: string;
} {
    const url = new URL(input);
    if (!['app.arcade.software', 'demo.arcade.software'].includes(url.hostname)) {
        return;
    }

    const parts = url.pathname.split('/');
    if (!['flows', 'share'].includes(parts[1])) {
        return;
    }

    return { flowId: parts[2] };
}
