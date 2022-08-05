/** @jsx contentKitHyperscript */

import { createComponentCallback, contentKitHyperscript } from '@gitbook/runtime';

addEventListener('fetch', (event) => {
    event.respondWith(
        new Response(
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
        )
    );
});

createComponentCallback<
    {
        text?: string;
    },
    { editing?: boolean },
    { action: 'edit' }
>({
    componentId: 'diagram',
    initialState: {},
    action: async (previous, action) => {
        return previous;
    },

    render: async ({ state }) => {
        return (
            <block>
                <webframe
                    source={{
                        url: environment.integration.urls.publicEndpoint,
                    }}
                    aspectRatio={16 / 9}
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
            </block>
        );
    },
});

createComponentCallback<{}, {}, {}>({
    componentId: 'edit-modal',
    initialState: {},
    render: async ({ state }) => {
        return (
            <modal title="Edit diagram" style="fullscreen">
                <hstack>
                    <box>
                        <textinput />
                    </box>
                    <box>
                        <webframe
                            source={{
                                url: environment.integration.urls.publicEndpoint,
                            }}
                        />
                    </box>
                </hstack>
            </modal>
        );
    },
});
