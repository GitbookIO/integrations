import { createIntegration, createComponent } from '@gitbook/runtime';

interface BlockProps {
    githubContent: string;
}

const splitUrl = (url: string) => {
    const regex = /^https?:\/\/github\.com\/([\w-]+)\/([\w-]+)\/blob\/([a-f0-9]+)\/(.+?)#(.+)$/;
    const match = url.match(regex);

    const orgName = match[1];
    const repoName = match[2];
    const ref = match[3];
    const fileName = match[4];
    const hash = match[5];
    let lines = [];

    if (hash !== '') {
        const lineFormatRegex = /^L\d+-L\d+$/;
        if (hash.match(lineFormatRegex)) {
            lines = hash.replace(/L/g, '').split('-').map(Number);
        } else {
            // Do other line format things
            //     https://github.com/GitbookIO/integrations/blob/main/integrations/jira/src/sdk.ts#:~:text=*/-,export%20async%20function%20getJIRASites(accessToken%3A%20string)%3A%20Promise,%7D,-/**
        }
    } else {
        // Show whole file
        // https://github.com/GitbookIO/integrations/blob/main/integrations/mailchimp/src/sdk.ts
    }

    return {
        orgName,
        repoName,
        fileName,
        ref,
        lines,
    };
};

const splitFileFromLines = (content, lines) => {
    return content.slice(lines[0] - 1, lines[1]);
};

const fetchContent = async (orgName, repoName, file, ref) => {
    const baseURL = `https://api.github.com/repos/${orgName}/${repoName}/contents/${file}?ref=${ref}`;

    const headers = {
        'User-Agent': 'request',
        Authorization: 'Bearer ',
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
            Authorization: `Bearer `,
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

const githubCodeBlock = createComponent({
    componentId: 'github-code-block',
    async action(block, action) {
        if (action.action === '@link.unfurl') {
            const urlObject = splitUrl(action.url);

            const userLoggedIn = await isUserLoggedIn();
            // console.log('userLoggedIn');
            // console.log(userLoggedIn);
            let content: string | boolean = '';

            if (userLoggedIn) {
                content = await fetchContent(
                    urlObject.orgName,
                    urlObject.repoName,
                    urlObject.fileName,
                    urlObject.ref,
                    urlObject.lines
                );

                // console.log('CONTENT');
                // console.log(content);

                if (content) {
                    if (urlObject.lines.length > 0) {
                        // convert content to string array
                        const contentArray = content.split('\n');
                        const splitContent = splitFileFromLines(contentArray, urlObject.lines);

                        // turn string array into string
                        content = splitContent.join('\n');
                    }
                }
            }

            return {
                props: {
                    content,
                    url: action.url,
                },
            };
        }
    },
    async render(block, context) {
        const { content, url } = block.props as BlockProps;

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
                    buttons={[
                        <button
                            icon="maximize"
                            tooltip="Open preview"
                            onPress={{
                                action: '@ui.modal.open',
                                componentId: 'previewModal',
                                props: {
                                    url,
                                },
                            }}
                        />,
                    ]}
                >
                    <codeblock content={content.toString()} lineNumbers={true} />
                </card>
            </block>
        );
    },
});

export default createIntegration({
    components: [githubCodeBlock],
});
