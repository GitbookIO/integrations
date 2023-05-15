// TODO: Remove console logs
import {
    createIntegration,
    createComponent,
    FetchEventCallback,
    RuntimeContext,
} from '@gitbook/runtime';

type IntegrationContext = {} & RuntimeContext;

export interface GitlabProps {
    url: string;
}
function getProject(url) {
    const namespaceEndIndex = url.indexOf('/', 8); // index of the first slash after "https://"
    const projectStartIndex = url.indexOf('/', namespaceEndIndex + 1) + 1;
    const projectEndIndex = url.indexOf('/-/blob/', projectStartIndex);
    const project = url.substring(projectStartIndex, projectEndIndex);
    const namespace = url.substring(8, namespaceEndIndex);
    return project.startsWith(`${namespace}/`) ? project.substring(namespace.length + 1) : project;
}

const splitGitlabUrl = (url) => {
    const gitlabLinkRegex =
        /^https?:\/\/(?:www\.)?gitlab\.com\/(?:(?:[^\/]+\/)+)?([^\/]+)\/([^\/]+)\/(?:-\/)?blob\/([^\/]+)\/(.+)$/;
    const matchGitlabLink = url.match(gitlabLinkRegex);

    const hashRegex = /#(.*)/;
    const namespaceRegex = /^https?:\/\/gitlab\.com\/([^/]+)/;
    const branchOrCommitRegex = /\/-\/blob\/([^/]+)/;
    const filePathRegex = /\/-\/blob\/[^/]+\/(.+)/;

    const matchesHashRegex = url.match(hashRegex);
    const matchesNamespaceRegex = url.match(namespaceRegex);
    const matchesBranchOrCommitRegex = url.match(branchOrCommitRegex);
    const matchesFilePathRegex = url.match(filePathRegex);

    let namespace = 'namespace initial';
    let projectName = 'project initial';
    let ref = 'ref initial';
    let file_path = 'file_path initial';
    let lines = [];

    if (matchGitlabLink) {
        namespace = matchesNamespaceRegex ? matchesNamespaceRegex[1].split('/')[0] : '';
        projectName = getProject(url);
        ref = matchesBranchOrCommitRegex ? matchesBranchOrCommitRegex[1].split('/')[0] : '';
        file_path = matchesFilePathRegex ? matchesFilePathRegex[1] : '';

        const hash = matchesHashRegex ? matchesHashRegex[0] : '';
        if (hash !== '') {
            lines = hash.match(/\d+/g).map(Number);
        }
        return {
            namespace,
            projectName,
            ref,
            file_path,
            lines,
        };
    }
};

const getLinesFromGitlabFile = (content, lines) => {
    if (lines.length > 1) {
        return content.slice(lines[0] - 1, lines[1]);
    } else {
        return content.slice(lines[0] - 1, lines[0]);
    }
};

const fetchGitlabFile = (nameSpace, projectName, filePath, ref) => {
    let body = '';
    const projectPath = `${nameSpace}/${projectName}`;
    // fullstops aren't being encoded so had to replace them manually
    const apiUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(
        projectPath
    )}/repository/files/${encodeURIComponent(filePath).replace('.', '%2E')}?ref=${ref}`;
    return fetch(apiUrl)
        .then(async (response) => {
            if (response.ok) {
                body = await response.text();
                return atob(JSON.parse(body).content);
            } else {
                throw new Error(
                    `Failed to fetch file from GitLab API (status code ${response.status})`
                );
            }
        })
        .catch((error) => {
            console.error(error);
        });
};

export const getGitlabContent = async (url: string) => {
    const urlObject = splitGitlabUrl(url);
    let content: string | boolean = '';

    content = await fetchGitlabFile(
        urlObject.namespace,
        urlObject.projectName,
        urlObject.file_path.split('#')[0],
        urlObject.ref
    );

    if (content) {
        if (urlObject.lines.length > 0) {
            const contentArray = content.split('\n');
            const splitContent = getLinesFromGitlabFile(contentArray, urlObject.lines);

            return splitContent.join('\n');
        }
    }

    return content;
};

const gitlabCodeBlock = createComponent<{ url?: string }, {}, {}>({
    componentId: 'gitlab-code-block',
    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;

                return {
                    props: {
                        url,
                    },
                };
            }
        }

        return element;
    },
    async render(element, context) {
        const { url } = element.props as GitlabProps;
        const content = await getGitlabContent(url);

        if (!content) {
            return (
                <block>
                    <card
                        title={'Not found'}
                        onPress={{
                            action: '@ui.url.open',
                            url,
                        }}
                        icon={
                            <image
                                source={{
                                    url: context.environment.integration.urls.icon,
                                }}
                                aspectRatio={1}
                            />
                        }
                    />
                </block>
            );
        }

        return (
            <block>
                <card
                    title={url}
                    onPress={{
                        action: '@ui.url.open',
                        url,
                    }}
                    icon={
                        <image
                            source={{
                                url: context.environment.integration.urls.icon,
                            }}
                            aspectRatio={1}
                        />
                    }
                >
                    <codeblock content={content.toString()} lineNumbers={true} />
                </card>
            </block>
        );
    },
});

export default createIntegration({
    components: [gitlabCodeBlock],
});
