export interface GithubProps {
    content: string;
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

const fetchGithubFile = async (orgName, repoName, file, ref) => {
    const baseURL = `https://api.github.com/repos/${orgName}/${repoName}/contents/${file}?ref=${ref}`;

    const headers = {
        'User-Agent': 'request',
        Authorization: 'Bearer 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',
    };

    const res = await fetch(baseURL, { headers }).catch((err) => {
        throw new Error(`Error fetching content from ${baseURL}. ${err}`);
    });

    if (!res.ok) {
        return false;
        // throw new Error(`Response status from ${baseURL}: ${res.status}`)
    }

    const body = await res.text();
    return atob(JSON.parse(body).content);
};

const isUserLoggedIn = async () => {
    return await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            'User-Agent': 'request',
            Authorization: `Bearer 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`,
        },
    })
        .then((response) => {
            if (response.ok) {
                // console.log('User is logged in');
                return true;
                // User is logged in
                // Perform action to display the code
            } else {
                // console.log('User is not logged in');
                return false;
                // User is not logged in
                // Redirect to login page or display a login form
            }
        })
        .catch((error) => {
            console.error('Error in https://api.github.com/user', error);
            return false;
        });
};

export const getGithubContent = async (url: string) => {
    const urlObject = splitGithubUrl(url);

    const userLoggedIn = await isUserLoggedIn();
    let content: string | boolean = '';

    if (userLoggedIn) {
        content = await fetchGithubFile(
            urlObject.orgName,
            urlObject.repoName,
            urlObject.fileName,
            urlObject.ref
        );

        if (content) {
            if (urlObject.lines.length > 0) {
                const contentArray = content.split('\n');
                const splitContent = getLinesFromGithubFile(contentArray, urlObject.lines);

                return splitContent.join('\n');
            }
        }
    }

    return '';
};
