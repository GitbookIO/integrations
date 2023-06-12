import { createIntegration, createComponent } from '@gitbook/runtime';

import { fetchHTML } from './stackblitz';

const defaultContent = '//TODO: Starter Javascript Project';

const diagramBlock = createComponent<
    {
        content?: string;
    },
    {
        content: string;
    }
>({
    componentId: 'diagram',
    initialState: (props) => {
        return {
            content: props.content || defaultContent,
        };
    },
    async render(element, { environment }) {
        await fetchHTML();
        const { editable } = element.context;
        const { content } = element.state;

        element.setCache({
            maxAge: 86400,
        });

        const output = (
            <webframe
                source={{
                    url: environment.integration.urls.publicEndpoint,
                }}
                aspectRatio={16 / 9}
                data={{
                    content: element.dynamicState('content'),
                }}
            />
        );

        return (
            <block>
                {editable ? (
                    <codeblock
                        state="content"
                        content={content}
                        syntax="stackblitz"
                        onContentChange={{
                            action: '@editor.node.updateProps',
                            props: {
                                content: element.dynamicState('content'),
                            },
                        }}
                        footer={[output]}
                    />
                ) : (
                    output
                )}
            </block>
        );
    },
});

// Required Form Fields

// project[title] = Project title
// project[description] = Project description
// project[files][FILE_PATH] = Contents of file, specify file path as key
// project[files][ANOTHER_FILE_PATH] = Contents of file, specify file path as key
// project[dependencies] = JSON string of dependencies field from package.json
// project[template] = Can be one of: typescript, angular-cli, create-react-app, javascript

export default createIntegration({
    components: [diagramBlock],
});
