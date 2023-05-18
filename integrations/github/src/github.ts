import { GithubRuntimeContext } from './types';

export interface GithubProps {
    url: string;
}

const splitGithubUrl = (url: string) => {
    const permalinkRegex =
        /^https?:\/\/github\.com\/([\w-]+)\/([\w-]+)\/blob\/([a-f0-9]+)\/(.+?)#(.+)$/;
    const wholeFileRegex = /^https?:\/\/github\.com\/([\w-]+)\/([\w-]+)\/blob\/([\w.-]+)\/(.+)$/;
    const multipleLineRegex = /^L\d+-L\d+$/;

    let orgName = '';
    let repoName = '';
    let ref = '';
    let fileName = '';
    let lines = [];

    if (url.match(permalinkRegex)) {
        const match = url.match(permalinkRegex);

        orgName = match[1];
        repoName = match[2];
        ref = match[3];
        fileName = match[4];
        const hash = match[5];

        if (hash !== '') {
            if (url.match(permalinkRegex)) {
                if (hash.match(multipleLineRegex)) {
                    lines = hash.replace(/L/g, '').split('-').map(Number);
                } else {
                    const singleLineNumberArray: number[] = [];
                    const parsedInt = parseInt(hash.replace(/L/g, ''), 10);
                    singleLineNumberArray.push(parsedInt);
                    singleLineNumberArray.push(parsedInt);
                    lines = singleLineNumberArray;
                }
            }
        }
    } else if (url.match(wholeFileRegex)) {
        const match = url.match(wholeFileRegex);

        orgName = match[1];
        repoName = match[2];
        ref = match[3];
        fileName = match[4];
    }
    return {
        orgName,
        repoName,
        fileName,
        ref,
        lines,
    };
};

const getLinesFromGithubFile = (content, lines) => {
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
    baseURL: string
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
    accessToken: string
) => {
    const baseURL = `https://api.github.com/repos/${orgName}/${repoName}/contents/${file}?ref=${ref}`;
    const headers = getHeaders(false, accessToken);

    return await getGithubApiResponse(headers, baseURL);
};

export const getGithubContent = async (url: string, context: GithubRuntimeContext) => {
    const urlObject = splitGithubUrl(url);
    let content: string | boolean = '';

    content = await fetchGithubFile(
        urlObject.orgName,
        urlObject.repoName,
        urlObject.fileName,
        urlObject.ref,
        context.environment.installation.configuration.oauth_credentials?.access_token
    );

    if (content) {
        if (urlObject.lines.length > 0) {
            const contentArray = content.split('\n');
            const splitContent = getLinesFromGithubFile(contentArray, urlObject.lines);

            return splitContent.join('\n');
        }
    }

    return content;
};
