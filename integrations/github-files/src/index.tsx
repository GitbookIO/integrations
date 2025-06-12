import { Router } from 'itty-router';

import { RequestUpdateIntegrationInstallation } from '@gitbook/api';
import {
    createIntegration,
    createComponent,
    createOAuthHandler,
    OAuthResponse,
    FetchEventCallback,
} from '@gitbook/runtime';

import { getGithubContent, getGithubSnippetContent, getGithubContentByParams, getGithubSnippetContentByParams, GithubProps } from './github';
import { GithubRuntimeContext, GithubSnippetProps, GithubSimpleProps } from './types';
import { getFileExtension } from './utils';

const embedBlock = createComponent<
    { url?: string; visible?: boolean },
    {},
    {
        action: 'show' | 'hide';
    },
    GithubRuntimeContext
>({
    componentId: 'github-code-block',
    initialState: {},

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;

                return {
                    props: {
                        ...element.props,
                        url,
                        visible: element.props.visible ?? true,
                    },
                };
            }
            case 'show': {
                return {
                    props: {
                        ...element.props,
                        visible: true,
                    },
                };
            }
            case 'hide': {
                return {
                    props: {
                        ...element.props,
                        visible: false,
                    },
                };
            }
        }

        return element;
    },

    async render(element, context) {
        const { url, visible = true } = element.props;
        const found = await getGithubContent(url, context);

        if (!found) {
            return (
                <block>
                    <card
                        title={'Not found'}
                        onPress={{
                            action: '@ui.url.open',
                            url,
                        }}
                        icon={
                            context.environment.integration.urls.icon ? (
                                <image
                                    source={{
                                        url: context.environment.integration.urls.icon,
                                    }}
                                    aspectRatio={1}
                                />
                            ) : undefined
                        }
                    />
                </block>
            );
        }

        const { content, fileName } = found;
        const fileExtension = await getFileExtension(fileName);

        return (
            <block
                controls={[
                    {
                        label: 'Show title & link',
                        onPress: {
                            action: 'show',
                        },
                    },
                    {
                        label: 'Hide title & link',
                        onPress: {
                            action: 'hide',
                        },
                    },
                ]}
            >
                <card
                    title={visible ? url : ''}
                    onPress={
                        visible
                            ? {
                                  action: '@ui.url.open',
                                  url,
                              }
                            : { action: 'null' }
                    }
                    icon={
                        context.environment.integration.urls.icon ? (
                            <image
                                source={{
                                    url: context.environment.integration.urls.icon,
                                }}
                                aspectRatio={1}
                            />
                        ) : undefined
                    }
                >
                    {content ? (
                        <codeblock
                            content={content.toString()}
                            lineNumbers={true}
                            syntax={fileExtension}
                        />
                    ) : null}
                </card>
            </block>
        );
    },
});

const snippetBlock = createComponent<
    GithubSnippetProps,
    {},
    {
        action: 'show' | 'hide' | 'updateUrl' | 'addSnippet' | 'removeSnippet' | 'updateSnippet';
        url?: string;
        snippetTag?: string;
        snippetId?: string;
    },
    GithubRuntimeContext
>({
    componentId: 'github-snippet-block',
    initialState: {},

    async action(element, action) {
        switch (action.action) {
            case 'updateUrl': {
                // Handle single snippet mode
                return {
                    props: {
                        ...element.props,
                        url: action.url,
                        snippetTag: action.snippetTag,
                    },
                };
            }
            case 'addSnippet': {
                // Convert to multi-snippet mode or add to existing
                const currentSnippets = element.props.snippets || [];
                const newSnippet = {
                    id: `snippet-${Date.now()}`,
                    url: '',
                    snippetTag: '',
                };
                return {
                    props: {
                        ...element.props,
                        snippets: [...currentSnippets, newSnippet],
                    },
                };
            }
            case 'removeSnippet': {
                const updatedSnippets = element.props.snippets?.filter(s => s.id !== action.snippetId) || [];
                return {
                    props: {
                        ...element.props,
                        snippets: updatedSnippets.length > 0 ? updatedSnippets : undefined,
                    },
                };
            }
            case 'updateSnippet': {
                const updatedSnippets = element.props.snippets?.map(snippet => 
                    snippet.id === action.snippetId 
                        ? { ...snippet, url: action.url || snippet.url, snippetTag: action.snippetTag || snippet.snippetTag }
                        : snippet
                ) || [];
                return {
                    props: {
                        ...element.props,
                        snippets: updatedSnippets,
                    },
                };
            }
            case 'show': {
                return {
                    props: {
                        ...element.props,
                        visible: true,
                    },
                };
            }
            case 'hide': {
                return {
                    props: {
                        ...element.props,
                        visible: false,
                    },
                };
            }
        }

        return element;
    },

    async render(element, context) {
        const { url, snippetTag, snippets, visible = true } = element.props;
        
        // Multi-snippet mode
        if (snippets && snippets.length > 0) {
            const snippetContents = await Promise.all(
                snippets.map(async (snippet) => {
                    if (!snippet.url || !snippet.snippetTag) {
                        return { snippet, content: null, fileName: '' };
                    }
                    const found = await getGithubSnippetContent(snippet.url, snippet.snippetTag, context);
                    return { snippet, content: found?.content || null, fileName: found?.fileName || '' };
                })
            );

            const validSnippets = snippetContents.filter(s => s.content);
            const combinedContent = validSnippets.map(s => s.content).join('\n\n');
            const fileExtension = validSnippets.length > 0 ? await getFileExtension(validSnippets[0].fileName) : '';

            return (
                <block
                    controls={[
                        {
                            label: 'Show title & link',
                            onPress: {
                                action: 'show',
                            },
                        },
                        {
                            label: 'Hide title & link',
                            onPress: {
                                action: 'hide',
                            },
                        },
                        {
                            label: 'Add Another Snippet',
                            onPress: {
                                action: 'addSnippet',
                            },
                        },
                    ]}
                >
                    <card
                        title={visible ? `Multi-Snippet (${snippets.length} snippets)` : ''}
                    >
                        {snippets.map((snippet, index) => (
                            <box key={snippet.id}>
                                <input
                                    label={`Snippet ${index + 1} - GitHub URL`}
                                    hint="Enter the GitHub file URL"
                                    element={
                                        <textinput
                                            state={`url-${snippet.id}`}
                                            placeholder="https://github.com/owner/repo/blob/main/file.js"
                                            initialValue={snippet.url}
                                        />
                                    }
                                />
                                <input
                                    label={`Snippet ${index + 1} - Tag`}
                                    hint="Enter the snippet tag name"
                                    element={
                                        <textinput
                                            state={`tag-${snippet.id}`}
                                            placeholder="ExampleTag"
                                            initialValue={snippet.snippetTag}
                                        />
                                    }
                                />
                                <hstack>
                                    <button
                                        label="Update"
                                        onPress={{
                                            action: 'updateSnippet',
                                            snippetId: snippet.id,
                                            url: element.dynamicState(`url-${snippet.id}`),
                                            snippetTag: element.dynamicState(`tag-${snippet.id}`),
                                        }}
                                    />
                                    <button
                                        label="Remove"
                                        onPress={{
                                            action: 'removeSnippet',
                                            snippetId: snippet.id,
                                        }}
                                    />
                                </hstack>
                            </box>
                        ))}

                        {combinedContent ? (
                            <codeblock
                                content={combinedContent}
                                lineNumbers={true}
                                syntax={fileExtension}
                            />
                        ) : null}
                    </card>
                </block>
            );
        }

        // Single snippet mode
        if (!url || !snippetTag) {
            return (
                <block>
                    <card>
                        <text>GitHub Code Snippet</text>
                        <input
                            label="GitHub URL"
                            hint="Enter the GitHub file URL"
                            element={
                                <textinput
                                    state="url"
                                    placeholder="https://github.com/owner/repo/blob/main/file.js"
                                    initialValue={url || ''}
                                />
                            }
                        />
                        <input
                            label="Snippet Tag"
                            hint="Enter the snippet tag name"
                            element={
                                <textinput
                                    state="snippetTag"
                                    placeholder="BaseOAuthExample"
                                    initialValue={snippetTag || ''}
                                />
                            }
                        />
                        <hstack>
                            <button
                                label="Load Snippet"
                                onPress={{
                                    action: 'updateUrl',
                                    url: element.dynamicState('url'),
                                    snippetTag: element.dynamicState('snippetTag'),
                                }}
                            />
                            <button
                                label="Add Multiple Snippets"
                                onPress={{
                                    action: 'addSnippet',
                                }}
                            />
                        </hstack>
                    </card>
                </block>
            );
        }

        const found = await getGithubSnippetContent(url, snippetTag, context);

        if (!found) {
            return (
                <block>
                    <card
                        title={'Not found'}
                        onPress={{
                            action: '@ui.url.open',
                            url,
                        }}
                        icon={
                            context.environment.integration.urls.icon ? (
                                <image
                                    source={{
                                        url: context.environment.integration.urls.icon,
                                    }}
                                    aspectRatio={1}
                                />
                            ) : undefined
                        }
                    />
                </block>
            );
        }

        const { content, fileName } = found;
        const fileExtension = await getFileExtension(fileName);

        return (
            <block
                controls={[
                    {
                        label: 'Show title & link',
                        onPress: {
                            action: 'show',
                        },
                    },
                    {
                        label: 'Hide title & link',
                        onPress: {
                            action: 'hide',
                        },
                    },
                    {
                        label: 'Add More Snippets',
                        onPress: {
                            action: 'addSnippet',
                        },
                    },
                ]}
            >
                <card
                    title={visible ? `${url} (${snippetTag})` : ''}
                    onPress={
                        visible
                            ? {
                                  action: '@ui.url.open',
                                  url,
                              }
                            : { action: 'null' }
                    }
                    icon={
                        context.environment.integration.urls.icon ? (
                            <image
                                source={{
                                    url: context.environment.integration.urls.icon,
                                }}
                                aspectRatio={1}
                            />
                        ) : undefined
                    }
                >
                    {content ? (
                        <codeblock
                            content={content.toString()}
                            lineNumbers={true}
                            syntax={fileExtension}
                        />
                    ) : null}
                </card>
            </block>
        );
    },
});

const simpleGithubBlock = createComponent<
    GithubSimpleProps,
    {},
    {
        action: 'show' | 'hide' | 'updateParams' | 'addFile' | 'removeFile' | 'updateFile';
        owner?: string;
        repo?: string;
        branch?: string;
        filePath?: string;
        snippetTag?: string;
        fileId?: string;
    },
    GithubRuntimeContext
>({
    componentId: 'github-simple-block',
    initialState: {},

    async action(element, action) {
        switch (action.action) {
            case 'updateParams': {
                return {
                    props: {
                        ...element.props,
                        owner: action.owner || element.props.owner,
                        repo: action.repo || element.props.repo,
                        branch: action.branch || element.props.branch,
                        filePath: action.filePath || element.props.filePath,
                        snippetTag: action.snippetTag || element.props.snippetTag,
                    },
                };
            }
            case 'addFile': {
                const currentFiles = element.props.files || [];
                const newFile = {
                    id: `file-${Date.now()}`,
                    filePath: '',
                    snippetTag: '',
                };
                return {
                    props: {
                        ...element.props,
                        files: [...currentFiles, newFile],
                    },
                };
            }
            case 'removeFile': {
                const updatedFiles = element.props.files?.filter(f => f.id !== action.fileId) || [];
                return {
                    props: {
                        ...element.props,
                        files: updatedFiles.length > 0 ? updatedFiles : undefined,
                    },
                };
            }
            case 'updateFile': {
                const updatedFiles = element.props.files?.map(file => 
                    file.id === action.fileId 
                        ? { ...file, filePath: action.filePath || file.filePath, snippetTag: action.snippetTag || file.snippetTag }
                        : file
                ) || [];
                return {
                    props: {
                        ...element.props,
                        files: updatedFiles,
                    },
                };
            }
            case 'show': {
                return {
                    props: {
                        ...element.props,
                        visible: true,
                    },
                };
            }
            case 'hide': {
                return {
                    props: {
                        ...element.props,
                        visible: false,
                    },
                };
            }
        }

        return element;
    },

    async render(element, context) {
        const { owner = '', repo = '', branch = 'main', filePath = '', snippetTag = '', files, visible = true } = element.props;
        
        // Multi-file mode
        if (files && files.length > 0) {
            const fileContents = await Promise.all(
                files.map(async (file) => {
                    if (!owner || !repo || !file.filePath) {
                        return { file, content: null, fileName: '' };
                    }
                    let found;
                    if (file.snippetTag) {
                        found = await getGithubSnippetContentByParams(owner, repo, branch, file.filePath, file.snippetTag, context);
                    } else {
                        found = await getGithubContentByParams(owner, repo, branch, file.filePath, context);
                    }
                    return { file, content: found?.content || null, fileName: found?.fileName || '' };
                })
            );

            const validFiles = fileContents.filter(f => f.content);
            const combinedContent = validFiles.map(f => {
                const label = f.file.snippetTag ? `// ${f.file.filePath} (${f.file.snippetTag})` : `// ${f.file.filePath}`;
                return `${label}\n${f.content}`;
            }).join('\n\n');
            const fileExtension = validFiles.length > 0 ? await getFileExtension(validFiles[0].fileName) : '';

            return (
                <block
                    controls={[
                        {
                            label: 'Show title & link',
                            onPress: {
                                action: 'show',
                            },
                        },
                        {
                            label: 'Hide title & link',
                            onPress: {
                                action: 'hide',
                            },
                        },
                        {
                            label: 'Add Another File',
                            onPress: {
                                action: 'addFile',
                            },
                        },
                    ]}
                >
                    <card
                        title={visible ? `${owner}/${repo} (${files.length} files)` : ''}
                    >
                        {files.map((file, index) => (
                            <box key={file.id}>
                                <input
                                    label={`File ${index + 1} - Path`}
                                    hint="Path to the file in the repository"
                                    element={
                                        <textinput
                                            state={`filePath-${file.id}`}
                                            placeholder="src/index.js"
                                            initialValue={file.filePath}
                                        />
                                    }
                                />
                                <input
                                    label={`File ${index + 1} - Snippet Tag (Optional)`}
                                    hint="Specific code snippet tag"
                                    element={
                                        <textinput
                                            state={`snippetTag-${file.id}`}
                                            placeholder="ExampleFunction"
                                            initialValue={file.snippetTag}
                                        />
                                    }
                                />
                                <hstack>
                                    <button
                                        label="Update"
                                        onPress={{
                                            action: 'updateFile',
                                            fileId: file.id,
                                            filePath: element.dynamicState(`filePath-${file.id}`),
                                            snippetTag: element.dynamicState(`snippetTag-${file.id}`),
                                        }}
                                    />
                                    <button
                                        label="Remove"
                                        onPress={{
                                            action: 'removeFile',
                                            fileId: file.id,
                                        }}
                                    />
                                </hstack>
                            </box>
                        ))}

                        {combinedContent ? (
                            <codeblock
                                content={combinedContent}
                                lineNumbers={true}
                                syntax={fileExtension}
                            />
                        ) : null}
                    </card>
                </block>
            );
        }

        // Single file mode or initial setup
        if (!owner || !repo || !filePath) {
            return (
                <block
                    controls={owner && repo && filePath ? [
                        {
                            label: 'Load Content',
                            onPress: {
                                action: 'updateParams',
                                owner: element.dynamicState('owner') || owner,
                                repo: element.dynamicState('repo') || repo,
                                branch: element.dynamicState('branch') || branch,
                                filePath: element.dynamicState('filePath') || filePath,
                                snippetTag: element.dynamicState('snippetTag') || snippetTag,
                            },
                        },
                        {
                            label: 'Add Multiple Files',
                            onPress: {
                                action: 'addFile',
                            },
                        },
                    ] : []}
                >
                    <card>
                        <text>Simple GitHub Reference</text>
                        <text>Enter repository details to reference a file or code snippet.</text>
                        
                        <input
                            label="Repository Owner"
                            hint="GitHub username or organization"
                            element={
                                <textinput
                                    state="owner"
                                    placeholder="octocat"
                                    initialValue={owner}
                                />
                            }
                        />
                        
                        <input
                            label="Repository Name"
                            hint="Repository name"
                            element={
                                <textinput
                                    state="repo"
                                    placeholder="Hello-World"
                                    initialValue={repo}
                                />
                            }
                        />
                        
                        <input
                            label="Branch/Tag"
                            hint="Branch or tag name (default: main)"
                            element={
                                <textinput
                                    state="branch"
                                    placeholder="main"
                                    initialValue={branch}
                                />
                            }
                        />
                        
                        <input
                            label="File Path"
                            hint="Path to the file in the repository"
                            element={
                                <textinput
                                    state="filePath"
                                    placeholder="src/index.js"
                                    initialValue={filePath}
                                />
                            }
                        />
                        
                        <input
                            label="Snippet Tag (Optional)"
                            hint="Specific code snippet tag"
                            element={
                                <textinput
                                    state="snippetTag"
                                    placeholder="ExampleFunction"
                                    initialValue={snippetTag}
                                />
                            }
                        />
                    </card>
                </block>
            );
        }

        // Single file loaded mode
        let found;
        if (snippetTag) {
            found = await getGithubSnippetContentByParams(owner, repo, branch, filePath, snippetTag, context);
        } else {
            found = await getGithubContentByParams(owner, repo, branch, filePath, context);
        }

        if (!found) {
            return (
                <block>
                    <card
                        title={'Not found'}
                        onPress={{
                            action: '@ui.url.open',
                            url: `https://github.com/${owner}/${repo}/blob/${branch}/${filePath}`,
                        }}
                        icon={
                            context.environment.integration.urls.icon ? (
                                <image
                                    source={{
                                        url: context.environment.integration.urls.icon,
                                    }}
                                    aspectRatio={1}
                                />
                            ) : undefined
                        }
                    />
                </block>
            );
        }

        const { content, fileName } = found;
        const fileExtension = await getFileExtension(fileName);
        const displayTitle = snippetTag ? `${owner}/${repo}/${filePath} (${snippetTag})` : `${owner}/${repo}/${filePath}`;

        return (
            <block
                controls={[
                    {
                        label: 'Show title & link',
                        onPress: {
                            action: 'show',
                        },
                    },
                    {
                        label: 'Hide title & link',
                        onPress: {
                            action: 'hide',
                        },
                    },
                    {
                        label: 'Add More Files',
                        onPress: {
                            action: 'addFile',
                        },
                    },
                ]}
            >
                <card
                    title={visible ? displayTitle : ''}
                    onPress={
                        visible
                            ? {
                                  action: '@ui.url.open',
                                  url: `https://github.com/${owner}/${repo}/blob/${branch}/${filePath}`,
                              }
                            : { action: 'null' }
                    }
                    icon={
                        context.environment.integration.urls.icon ? (
                            <image
                                source={{
                                    url: context.environment.integration.urls.icon,
                                }}
                                aspectRatio={1}
                            />
                        ) : undefined
                    }
                >
                    {content ? (
                        <codeblock
                            content={content.toString()}
                            lineNumbers={true}
                            syntax={fileExtension}
                        />
                    ) : null}
                </card>
            </block>
        );
    },
});

const handleFetchEvent: FetchEventCallback<GithubRuntimeContext> = async (request, context) => {
    const { environment } = context;

    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint,
        ).pathname,
    });

    /*
     * Authenticate the user using OAuth.
     */
    router.get(
        '/oauth',
        // @ts-ignore
        createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: environment.secrets.CLIENT_ID,
            clientSecret: environment.secrets.CLIENT_SECRET,
            authorizeURL: 'https://github.com/login/oauth/authorize',
            accessTokenURL: 'https://github.com/login/oauth/access_token',
            scopes: ['repo'],
            prompt: 'consent',
            extractCredentials,
        }),
    );

    const response = await router.handle(request, context);
    if (!response) {
        return new Response(`No route matching ${request.method} ${request.url}`, {
            status: 404,
        });
    }

    return response;
};

const extractCredentials = async (
    response: OAuthResponse,
): Promise<RequestUpdateIntegrationInstallation> => {
    const { access_token } = response;

    return {
        configuration: {
            oauth_credentials: {
                access_token,
                expires_at: Date.now() + response.expires_in * 1000,
                refresh_token: response.refresh_token,
            },
        },
    };
};

export default createIntegration<GithubRuntimeContext>({
    fetch: handleFetchEvent,
    components: [embedBlock, snippetBlock, simpleGithubBlock],
});
