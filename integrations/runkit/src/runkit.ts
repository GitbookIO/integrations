interface RunKitCell {
    content: {
        type: 'rich-text' | 'source';
        text: string;
    };
}

interface RunKitRepoContent {
    content: {
        title: string;
        cells: Array<RunKitCell>;
        package: {
            engines: {
                node: string;
            };
        };
    };
}

/**
 * Execute a RunKit API request.
 */
async function fetchRunKitAPI<APIResponse>(path: string): Promise<APIResponse> {
    const url = new URL(`https://runkit.com/api/${path}`);

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const result = await response.json<APIResponse>();

    return result;
}

/**
 * Fetch RunKit source
 */
export async function fetchRunKitFromLink(
    link: string,
): Promise<{ content: string; nodeVersion: string }> {
    const url = new URL(link);

    if (url.hostname !== 'runkit.com') {
        return;
    }

    const [user, repoId] = url.pathname.split('/').slice(1);
    if (!user || !repoId) {
        return;
    }

    const repo = await fetchRunKitAPI<RunKitRepoContent>(
        `users/${user}/repositories/${repoId}/default`,
    );

    const source = repo.content.cells
        .filter((cell) => cell.content.type === 'source')
        .map((cell) => cell.content.text)
        .join('\n');

    return {
        content: source,
        nodeVersion: repo.content.package.engines.node,
    };
}
