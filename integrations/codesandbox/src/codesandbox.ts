/**
 * Extract the CodeSandbox link props (subdomain and value) from the embed URL.
 */
export function extractCodeSandboxLinkPropsFromURL(input: string): {
    codeSandBoxId?: string;
    search?: string;
} {
    const url = new URL(input);

    if (url.hostname !== 'codesandbox.io') {
        return;
    }

    const parts = url.pathname.split('/');
    return {
        codeSandBoxId: parts[2],
        search: url.search,
    };
}
