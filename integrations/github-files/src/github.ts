import { ExposableError } from '@gitbook/runtime';
import { GithubInstallationConfiguration, GithubRuntimeContext, GithubSnippetProps } from './types';

export interface GithubProps {
    url: string;
}

const constructGithubUrl = (owner: string, repo: string, branch: string, filePath: string) => {
    return `https://github.com/${owner}/${repo}/blob/${branch}/${filePath}`;
};

const splitGithubUrl = (url: string) => {
    // Enhanced patterns to handle more GitHub URL formats including branches, tags, and commits
    const generalBlobRegex = /^https?:\/\/github\.com\/([\w-]+)\/([\w-]+)\/blob\/([^\/]+)\/(.+?)(?:#(.+))?$/;
    const multipleLineRegex = /^L\d+-L\d+$/;

    let orgName = '';
    let repoName = '';
    let ref = '';
    let fileName = '';
    let lines: number[] = [];

    // Try to match general blob pattern (handles branches, tags, commits)
    const generalMatch = url.match(generalBlobRegex);
    if (generalMatch) {
        orgName = generalMatch[1];
        repoName = generalMatch[2];
        ref = generalMatch[3];
        fileName = generalMatch[4];
        const hash = generalMatch[5];

        // Handle line numbers if present
        if (hash && hash !== '') {
            if (hash.match(multipleLineRegex)) {
                lines = hash.replace(/L/g, '').split('-').map(Number);
            } else if (hash.startsWith('L')) {
                const singleLineNumberArray: number[] = [];
                const parsedInt = parseInt(hash.replace(/L/g, ''), 10);
                singleLineNumberArray.push(parsedInt);
                singleLineNumberArray.push(parsedInt);
                lines = singleLineNumberArray;
            }
        }
    }
    return {
        orgName,
        repoName,
        fileName,
        ref,
        lines,
    };
};

const getLinesFromGithubFile = (content: string[], lines: number[]) => {
    return content.slice(lines[0] - 1, lines[1]);
};

const extractSnippetSection = (content: string, snippetTag: string) => {
    const lines = content.split('\n');
    const startMarker = `--8<-- [start:${snippetTag}]`;
    const endMarker = `--8<-- [end:${snippetTag}]`;

    let startIndex = -1;
    let endIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes(startMarker)) {
            startIndex = i + 1; // Start from the line after the marker
        } else if (line.includes(endMarker) && startIndex !== -1) {
            endIndex = i; // End at the line before the marker
            break;
        }
    }

    if (startIndex === -1 || endIndex === -1) {
        return null; // Snippet tag not found
    }

    return lines.slice(startIndex, endIndex).join('\n');
};

const getHeaders = (authorise: boolean, accessToken = '') => {
    const headers: { 'User-Agent': string; Authorization?: string } = {
        'User-Agent': 'request',
    };

    if (authorise) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    return headers;
};

const getGithubApiResponse = async (
    headers: { 'User-Agent': string; Authorization?: string },
    baseURL: string,
) => {
    const res = await fetch(baseURL, { headers }).catch((err) => {
        throw new Error(`Error fetching content from ${baseURL}. ${err}`);
    });

    if (!res.ok) {
        if (res.status === 403 || res.status === 404) {
            return false;
        } else {
            throw new Error(`Response status from ${baseURL}: ${res.status}`);
        }
    }

    const body = await res.text();
    return atob(JSON.parse(body).content);
};

const fetchGithubFile = async (
    orgName: string,
    repoName: string,
    file: string,
    ref: string,
    accessToken: string,
) => {
    const baseURL = `https://api.github.com/repos/${orgName}/${repoName}/contents/${file}?ref=${ref}`;
    const headers = getHeaders(accessToken !== '', accessToken);

    return await getGithubApiResponse(headers, baseURL);
};

export const getGithubContent = async (url: string, context: GithubRuntimeContext) => {
    const urlObject = splitGithubUrl(url);
    if (!urlObject) {
        return;
    }

    let content: string | boolean = '';
    const configuration = context.environment.installation
        ?.configuration as GithubInstallationConfiguration;
    const accessToken = configuration.oauth_credentials?.access_token;
    if (!accessToken) {
        throw new ExposableError('Integration is not authenticated with GitHub');
    }

    content = await fetchGithubFile(
        urlObject.orgName,
        urlObject.repoName,
        urlObject.fileName,
        urlObject.ref,
        accessToken,
    );

    if (content) {
        if (urlObject.lines.length > 0) {
            const contentArray = content.split('\n');
            const splitContent = getLinesFromGithubFile(contentArray, urlObject.lines);

            content = splitContent.join('\n');
        }
    }

    return { content, fileName: urlObject.fileName };
};

export const getGithubSnippetContent = async (
    url: string,
    snippetTag: string,
    context: GithubRuntimeContext,
) => {
    const urlObject = splitGithubUrl(url);
    if (!urlObject) {
        return;
    }

    let content: string | boolean = '';
    const configuration = context.environment.installation
        ?.configuration as GithubInstallationConfiguration;
    const accessToken = configuration.oauth_credentials?.access_token;
    if (!accessToken) {
        throw new ExposableError('Integration is not authenticated with GitHub');
    }

    content = await fetchGithubFile(
        urlObject.orgName,
        urlObject.repoName,
        urlObject.fileName,
        urlObject.ref,
        accessToken,
    );

    if (content && snippetTag) {
        const snippetContent = extractSnippetSection(content, snippetTag);
        if (snippetContent === null) {
            throw new ExposableError(`Snippet tag '${snippetTag}' not found in file`);
        }
        content = snippetContent;
    }

    return { content, fileName: urlObject.fileName };
};

export const getGithubContentByParams = async (
    owner: string,
    repo: string,
    branch: string,
    filePath: string,
    context: GithubRuntimeContext,
) => {
    const url = constructGithubUrl(owner, repo, branch, filePath);
    return await getGithubContent(url, context);
};

export const getGithubSnippetContentByParams = async (
    owner: string,
    repo: string,
    branch: string,
    filePath: string,
    snippetTag: string,
    context: GithubRuntimeContext,
) => {
    const url = constructGithubUrl(owner, repo, branch, filePath);
    return await getGithubSnippetContent(url, snippetTag, context);
};
