import { GithubRuntimeContext } from './types';

export interface GithubProps {
    url: string;
}

const splitGithubUrl = (url: string) => {
    const permalinkTypeRegex =
        /^https?:\/\/github\.com\/([\w-]+)\/([\w-]+)\/blob\/([a-f0-9]+)\/(.+?)#(.+)$/;
    const wholeFileTypeRegex =
        /^https?:\/\/github\.com\/([\w-]+)\/([\w-]+)\/blob\/([\w.-]+)\/(.+)$/;

    const permalinkMatch = url.match(permalinkTypeRegex);
    const wholeFileMatch = url.match(wholeFileTypeRegex);

    if (permalinkMatch) {
        const [, orgName, repoName, ref, fileName, hash] = permalinkMatch;
        const lines = hash ? hash.replace(/L/g, '').split('-').map(Number) : [];
        return { orgName, repoName, ref, fileName, lines };
    } else if (wholeFileMatch) {
        const [, orgName, repoName, ref, fileName] = wholeFileMatch;
        return { orgName, repoName, ref, fileName, lines: [] };
    }
};

const getLinesFromGithubFile = (content, lines) => {
    return content.slice(lines[0] - 1, lines[1]);
};

const fetchGithubFile = async (orgName, repoName, file, ref, accessToken: string) => {
    const baseURL = `https://api.github.com/repos/${orgName}/${repoName}/contents/${file}?ref=${ref}`;

    const headers = {
        'User-Agent': 'request',
        Authorization: `Bearer ${accessToken}`,
    };

    const res = await fetch(baseURL, { headers }).catch((err) => {
        throw new Error(`Error fetching content from ${baseURL}. ${err}`);
    });

    if (!res.ok) {
        throw new Error(`Response status from ${baseURL}: ${res.status}`);
    }

    const body = await res.text();
    return atob(JSON.parse(body).content);
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

    return '';
};
