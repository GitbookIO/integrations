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
        if (element.context.type !== 'document') {
            throw new Error('Invalid context');
        }
        const { editable } = element.context;
        const { content } = element.state;

        element.setCache({
            maxAge: 86400,
        });

        const url = new URL(environment.integration.urls.publicEndpoint);
        url.searchParams.set('v', String(environment.integration.version));

        const output = (
            <webframe
                source={{
                    url: url.toString(),
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
    fetch: async () => {
        return new Response(
            `<html>
                <style>
                * { margin: 0; padding: 0; }
                </style>
                <body>
                    <script type="module">
                        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
                        mermaid.initialize({ startOnLoad: false });

                        const queue = [];

                        function pushRenderDiagram(content) {
                            console.log('mermaid: queue diagram', { content });
                            queue.push(content);

                            if (queue.length === 1) {
                                processQueue();
                            }
                        }

                        async function processQueue() {
                            console.log('mermaid: process queue', queue.length);
                            if (queue.length > 0) {
                                const content = queue[0];
                                try {
                                    await renderDiagram(content);
                                } catch (error) {
                                    console.error('mermaid: render error', error);
                                }

                                queue.shift();
                            }

                            if (queue.length > 0) {
                                await processQueue();
                            }
                        }

                        async function renderDiagram(content) {
                            console.log('mermaid: render diagram', { content });
                            const { svg: svgGraph } = await mermaid.render('output', content);

                            document.getElementById('content').innerHTML = svgGraph;
                            const svg = document.getElementById('content').querySelector('svg');
                            const size = { width: svg.viewBox.baseVal.width, height: svg.viewBox.baseVal.height };

                            console.log('mermaid: resize', size);
                            sendAction({
                                action: '@webframe.resize',
                                size: {
                                    aspectRatio: size.width / size.height,
                                    height: size.height,
                                }
                            });
                        }

                        function sendAction(action) {
                            window.parent.postMessage(
                                {
                                    action,
                                },
                                '*'
                            );
                        }

                        window.addEventListener("message", (event) => {
                            if (
                                event.data &&
                                typeof event.data.state === 'object' &&
                                typeof event.data.state.content === 'string'
                            ) {
                                const content = event.data.state.content;
                                pushRenderDiagram(content)
                            } else {
                             console.log('mermaid: invalid message', event.data);
                            }
                        });

                        document.addEventListener("DOMContentLoaded", function(e) {
                            console.log("mermaid: ready");
                            sendAction({
                                action: '@webframe.ready'
                            });
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
            },
        );
    },
    components: [diagramBlock],
});
