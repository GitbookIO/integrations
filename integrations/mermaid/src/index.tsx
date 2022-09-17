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
        
    <body>
        <div id="content" class="mermaid">
        graph TD 
        A[Client] --> B[Load Balancer] 
        B --> C[Server01] 
        B --> D[Server02]
        </div>
        <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
        <script>
        const graphDefinition = 'graph TB\na-->b';
        const cb = function (svgGraph) {
           console.log(svgGraph);
        };
        mermaid.render('content', graphDefinition, cb);
            mermaid.initialize({
                startOnLoad: true,
                callback: (id) => {
                    const div = document.getElementById('content');
                    console.log(div.clientHeight)
                },
            });
        </script>
    </body>
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
