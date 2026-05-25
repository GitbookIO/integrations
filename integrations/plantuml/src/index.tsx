import { createIntegration, createComponent } from '@gitbook/runtime';

const defaultContent = `@startuml
Bob -> Alice: Hello!
@enduml`;

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
                        syntax="plantuml"
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
                <head>
                    <meta name="color-scheme" content="light dark">
                </head>
                <style>
                * { margin: 0; padding: 0; }
                </style>
                <body>
                    <script type="module">
                        import pako from 'https://cdn.jsdelivr.net/npm/pako@2.1.0/+esm';

                        let lastContent;

                        const queue = [];

                        function encode64(data) {
                            const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
                            let res = "";
                            for (let i = 0; i < data.length; i += 3) {
                            if (i + 2 === data.length) {
                                res += append3bytes(data[i], data[i + 1], 0, alphabet);
                            } else if (i + 1 === data.length) {
                                res += append3bytes(data[i], 0, 0, alphabet);
                            } else {
                                res += append3bytes(data[i], data[i + 1], data[i + 2], alphabet);
                            }
                            }
                            return res;
                        }

                        function append3bytes(b1, b2, b3, alphabet) {
                            const c1 = b1 >> 2;
                            const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
                            const c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
                            const c4 = b3 & 0x3f;
                            return (
                                alphabet.charAt(c1 & 0x3f) +
                                alphabet.charAt(c2 & 0x3f) +
                                alphabet.charAt(c3 & 0x3f) +
                                alphabet.charAt(c4 & 0x3f)
                            );
                        }

                        function encodePlantUML(text) {
                            const utf8 = new TextEncoder().encode(text);
                            const deflated = pako.deflateRaw(utf8, { level: 9 }); // Uint8Array
                            return encode64(deflated);
                        }

                        function pushRenderDiagram(content) {
                            console.log('[plantuml.pushRenderDiagram]: queue diagram', { content });
                            queue.push(content);

                            if (queue.length === 1) {
                                processQueue();
                            }
                        }

                        async function processQueue() {
                            console.log('[plantuml.pushRenderDiagram]: process queue', queue.length);
                            if (queue.length > 0) {
                                const content = queue[0];
                                try {
                                    await renderDiagram(content);
                                    lastContent = content;
                                } catch (error) {
                                    console.error('plantuml: render error', error);
                                }

                                queue.shift();
                            }

                            if (queue.length > 0) {
                                await processQueue();
                            }
                        }


                        async function renderDiagram(content) {
                            console.log('[plantuml.renderDiagram]: content: ', content);

                            const encoded = encodePlantUML(content);
                            console.log('[plantuml.renderDiagram]: encoded: ', encoded);

                            const url = "https://www.plantuml.com/plantuml/svg/" + encoded;
                            document.getElementById("umlDiagram").src = url;
                        }

                        function sendAction(action) {
                            window.parent.postMessage(
                                {
                                    action,
                                },
                                '*'
                            );
                        }

                        function resizeWebframe() {
                            const rect = document.getElementById("umlDiagram").getBoundingClientRect();
                            const width = rect.width;
                            const height = rect.height;
                            const aspectRatio = width && height ? width / height : 16 / 9;

                            console.log('[plantuml.resizeWebframe]:', { width, aspectRatio, height });

                            sendAction({
                                action: '@webframe.resize',
                                size: {
                                    aspectRatio: aspectRatio,
                                    height: height,
                                }
                            });
                        }

                        function onLoaded(e) {
                            console.log('[plantuml.onLoaded]: ready');
                            sendAction({
                                action: '@webframe.ready'
                            });

                            document.getElementById("umlDiagram").onload = function() {
                                resizeWebframe();
                            }
                                
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
                                console.log('[plantuml.onMessage]: invalid message', event.data);
                            }
                        });

                        if (document.readyState !== 'loading') {
                            onLoaded();
                        } else {
                            document.addEventListener('DOMContentLoaded', onLoaded);
                        }
                    </script>
                    <div id="content">
                        <img id="umlDiagram" alt="PlantUML Diagram" style="width: 100%" />
                    </div>
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
