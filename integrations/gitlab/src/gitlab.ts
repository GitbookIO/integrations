import { GitlabRuntimeContext } from './types';

export interface GitlabProps {
    url: string;
}

function getProject(url) {
    const namespaceEndIndex = url.indexOf('/', 8);
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

    let namespace = '';
    let projectName = '';
    let ref = '';
    let filePath = '';
    let lines = [];

    if (matchGitlabLink) {
        namespace = matchesNamespaceRegex ? matchesNamespaceRegex[1].split('/')[0] : '';
        projectName = getProject(url);
        ref = matchesBranchOrCommitRegex ? matchesBranchOrCommitRegex[1].split('/')[0] : '';
        filePath = matchesFilePathRegex ? matchesFilePathRegex[1] : '';

        const hash = matchesHashRegex ? matchesHashRegex[0] : '';
        if (hash !== '') {
            lines = hash.match(/\d+/g).map(Number);
        }
        return {
            namespace,
            projectName,
            ref,
            filePath,
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

const getHeaders = (authorise: boolean, accessToken = '') => {
    const headers: { 'User-Agent': string; 'Private-Token'?: string } = {
        'User-Agent': 'request',
    };

    if (authorise) {
        headers['Private-Token'] = `${accessToken}`;
    }

    return headers;
};

const getGitlabApiResponse = async (
    headers: { 'User-Agent': string; Authorization?: string },
    baseURL: string
) => {
    const res = await fetch(baseURL, { headers }).catch((err) => {
        throw new Error(`Error fetching content from ${baseURL}. ${err}`);
    });

    if (!res.ok) {
        if (res.status === 401 || res.status === 403 || res.status === 404) {
            return false;
        } else {
            throw new Error(`Response status from ${baseURL}: ${res.status}`);
        }
    }

    const body = await res.text();
    return atob(JSON.parse(body).content);
};

const fetchGitlabFile = async (
    nameSpace: string,
    projectName: string,
    filePath: string,
    ref: string,
    accessToken: string
) => {
    const projectPath = `${nameSpace}/${projectName}`;
    const baseURL = `https://gitlab.com/api/v4/projects/${encodeURIComponent(
        projectPath
    )}/repository/files/${encodeURIComponent(filePath).replace('.', '%2E')}?ref=${ref}`;
    const headers = getHeaders(accessToken !== '', accessToken);

    return await getGitlabApiResponse(headers, baseURL);
};

export const getGitlabContent = async (url: string, context: GitlabRuntimeContext) => {
    const urlObject = splitGitlabUrl(url);
    let content: string | boolean = '';
    content = await fetchGitlabFile(
        urlObject.namespace,
        urlObject.projectName,
        urlObject.filePath.split('#')[0],
        urlObject.ref,
        context.environment.installation.configuration.oauth_credentials?.access_token
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
