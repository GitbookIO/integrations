import { createIntegration, createComponent } from "@gitbook/runtime";

const diagramBlock = createComponent<{
    content: string;
}>({
    componentId: 'diagram',
    initialState: {},
    async render({ props, state }, { environment }) {
        const { content } = props;
        
        return (
            <block>
                <box style="card">
                    <vstack>
                        <webframe
                            source={{
                                url: environment.integration.urls.publicEndpoint,
                            }}
                            aspectRatio={16 / 9}
                            data={{
                                content,
                            }}
                            buttons={[
                                <button
                                    icon="edit"
                                    label="Edit diagram"
                                    action={{
                                        action: '@ui.modal.open',
                                        componentId: 'edit-modal',
                                        props: {},
                                    }}
                                />,
                            ]}
                        />
                        <divider />
                        <codeblock content={content} syntax="mermaid" />
                    </vstack>
                </box>
            </block>
        );
    }
})


export default createIntegration({
    events: {
        fetch: async (event) => {
            return new Response(
                `
                <html>
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
                                console.log(size);

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
            </html>
                `,
                {
                    headers: {
                        'Content-Type': 'text/html',
                    },
                }
            );
        }
    },
    components: [diagramBlock]
});
