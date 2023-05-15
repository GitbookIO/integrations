// TODO: Remove console logs
import {
    createIntegration,
    createComponent,
    FetchEventCallback,
    RuntimeContext,
} from '@gitbook/runtime';

type IntegrationContext = {} & RuntimeContext;

export interface GitlabProps {
    gitlabContent: string;
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
    let branch = 'branch initial';
    let file_path = 'file_path initial';
    let lines = [];

    if (matchGitlabLink) {
        namespace = matchesNamespaceRegex ? matchesNamespaceRegex[1].split('/')[0] : '';
        projectName = getProject(url);
        branch = matchesBranchOrCommitRegex ? matchesBranchOrCommitRegex[1].split('/')[0] : '';
        // file_path = matchesFilePathRegex ? `${branch}/${matchesFilePathRegex[1]}` : '';
        file_path = matchesFilePathRegex ? matchesFilePathRegex[1] : '';
        console.log('FILE_PATH');
        console.log(file_path);

        const hash = matchesHashRegex ? matchesHashRegex[0] : '';
        if (hash !== '') {
            lines = hash.match(/\d+/g).map(Number);
        }
        return {
            namespace,
            projectName,
            branch,
            file_path,
            lines,
        };
    }
};

const fetchGitlabProjectId = (nameSpace, projectName, filePath, branch) => {
    const projectPath = `${nameSpace}/${projectName}`;
    const apiUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(
        projectPath
    )}/repository/files/${encodeURIComponent(filePath).replace('.', '%2E')}?ref=${branch}`;
    return fetch(apiUrl)
        .then((response) => {
            if (response.ok) {
                return response.text();
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

const gitlabCodeBlock = createComponent<{ url?: string }, {}, {}>({
    componentId: 'gitlab-code-block',
    async action(element, action) {
        if (action.action === '@link.unfurl') {
            const { url } = action;
            const urlObject = splitGitlabUrl(url);
            fetchGitlabProjectId(urlObject.namespace, urlObject.projectName, urlObject.file_path.split('#')[0], urlObject.branch).then(
                (fileContent) => {
                console.log('FILECONTENT');
                console.log(fileContent);
            });
            console.log('URL_OBJECT');
            console.log(urlObject);
            // TODO: Get filename and branch from URL
            return {
                props: {
                    url,
                },
            };
        }
        return element;
    },
    async render(block) {
        // const { gitlabContent } = block.props as GitlabProps;

        return (
            <block>
                <codeblock content="{gitlabContent.toString()}" lineNumbers={true} />
            </block>
        );
    },
});

export default createIntegration({
    components: [gitlabCodeBlock],
});
