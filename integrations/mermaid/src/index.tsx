import { createIntegration, createComponent } from '@gitbook/runtime';

const defaultContent = `graph TD
  Mermaid --> Diagram`;

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
                        syntax="mermaid"
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

export default createIntegration({
    fetch: async (request) => {
        return new Response(
            `<html>
                <style>
                * { margin: 0; padding: 0; }
                </style>
                <body>
                    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
                    <script>
                    console.log("iframe: initialize");
                        mermaid.initialize({ startOnLoad: false });
            
                        function renderDiagram(content) {
                            mermaid.render('output', content,  (svgGraph) => {
                                document.getElementById('content').innerHTML = svgGraph;
                                const svg = document.getElementById('content').querySelector('svg');
                                const size = { width: svg.viewBox.baseVal.width, height: svg.viewBox.baseVal.height };

                                sendAction({
                                    action: '@webframe.resize',
                                    size: {
                                        aspectRatio: size.width / size.height,
                                        maxHeight: size.height,
                                        maxWidth: size.width,
                                    }
                                })
                            }); 
                        }

                        function sendAction(action) {
                            console.log('sendAction', action);
                            window.top.postMessage(
                                {
                                    action,
                                },
                                '*'
                            );
                        }
            
                        window.addEventListener("message", (event) => {
                            console.log("iframe: Received message", event.data);
                            if (event.data) {
                                const content = event.data.state.content;
                                renderDiagram(content)
                            }
                        });

                        sendAction({
                            action: '@webframe.ready'
                        });
                    </script>
                    <div id="content"></div>
                </body>
            </html>`,
            {
                headers: {
                    'Content-Type': 'text/html',
                    'Cache-Control': 'public, max-age=86400',
                },
            }
        );
    },
    components: [diagramBlock],
});
