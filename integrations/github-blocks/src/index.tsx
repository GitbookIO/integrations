/** @jsx contentKitHyperscript */

import { createComponentCallback, contentKitHyperscript } from '@gitbook/runtime';

createComponentCallback<
    {
        url?: string;
    },
    {},
    { action: 'edit' }
>({
    componentId: 'snippet',
    initialState: {},
    action: async (previous, action) => {
        return previous;
    },

    render: async ({ props, state }) => {
        const { url } = props;

        const parsed = url ? parseGitHubURL(url) : null;
        if (!parsed) {
            return (
                <block>
                    <box style="card">
                        <hstack>
                            <box>
                                <text>Select a file from GitHub</text>
                            </box>
                            <spacer />
                            <box>
                                <button label="Select file" action={{}} />
                            </box>
                        </hstack>
                    </box>
                </block>
            );
        }

        const res = await fetch(
            `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/contents/${parsed.file}?ref=${parsed.branch}`
        );
        const data = await res.json();
        const content = atob(data.content);

        const lines = content.split('\n');
        const startLine = parsed.startLine || 1;
        const endLine = parsed.endLine || lines.length + 1;

        const selectedLines = lines.slice(startLine - 1, endLine);
        const codeBlockContent = selectedLines.join('\n');

        return (
            <block>
                <codeblock content={codeBlockContent} syntax="javascript" lineNumbers={startLine} />
            </block>
        );
    },
});

function parseGitHubURL(url: string): null | {
    owner: string;
    repo: string;
    branch: string;
    file: string;
    startLine?: number;
    endLine?: number;
} {
    const parsed = new URL(url);

    const matchPathname = parsed.pathname.match(/^\/(.*)\/(.*)\/blob\/(.*)\/(.*)$/);
    const matchHash = parsed.hash.match(/^#L(\d+)-L(\d+)$/);

    if (!matchPathname) {
        return null;
    }

    const [, owner, repo, branch, file] = matchPathname;
    const [, startLine, endLine] = matchHash || [0, '0', '0'];

    return {
        owner,
        repo,
        branch,
        file,
        startLine: startLine ? parseInt(startLine, 10) : undefined,
        endLine: endLine ? parseInt(endLine, 10) : undefined,
    };
}
