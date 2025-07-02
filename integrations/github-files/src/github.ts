import { ExposableError } from '@gitbook/runtime';
import type { GithubInstallationConfiguration, GithubRuntimeContext } from './types';

export interface GithubProps {
    url: string;
}

/**
 * Extract the parts from a github URL
 */
const splitGithubUrl = (url: string) => {
    const urlWithoutQuery = url.split('?')[0];
    const baseRegex = /^https?:\/\/github\.com\/([\w-]+)\/([a-zA-Z0-9._-]+)\/blob\/(.+)$/;
    const baseMatch = urlWithoutQuery.match(baseRegex);

    if (!baseMatch) {
        return undefined;
    }

    const orgName = baseMatch[1];
    const repoName = baseMatch[2];
    const restOfPath = baseMatch[3];

    let lines: number[] = [];
    let pathWithoutLines = restOfPath;

    // Get the lines from the URL
    const lineNumberRegex = /#L(\d+)(?:-L(\d+))?$/;
    const lineMatch = restOfPath.match(lineNumberRegex);

    if (lineMatch) {
        const startLine = Number.parseInt(lineMatch[1], 10);
        const endLine = lineMatch[2] ? Number.parseInt(lineMatch[2], 10) : startLine;
        lines = [startLine, endLine];
        pathWithoutLines = restOfPath.replace(lineNumberRegex, '');
    }

    // Split the remaining path to separate ref from file path
    const pathParts = pathWithoutLines.split('/');

    // The first part is always the ref (branch/tag)
    const ref = pathParts[0];

    // Everything after the first part is the file path
    const fileName = pathParts.slice(1).join('/');

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
        }
        throw new Error(`Response status from ${baseURL}: ${res.status}`);
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
