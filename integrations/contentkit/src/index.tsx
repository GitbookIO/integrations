import { createIntegration, createComponent } from "@gitbook/runtime";

const previewBlock = createComponent<{
    content: string;
}, {
    action: object
}, object>({
    componentId: 'preview',
    initialState: {},
    async action(element, action) {
        return {
            ...element,
            state: {
                action: JSON.stringify(action),
            }
        }
    },
    async render({ props, state }) {
        const { content } = props;
        const { action } = state;

        if (!content) {
            return (
                <block>
                    <box>
                        <text>No content</text>
                    </box>
                </block>
            )
        }

        const parsed = JSON.parse(content);
        return (
            <block>
                <box>
                    <vstack>
                        <hstack>
                            <box>
                                <codeblock content={content} syntax="javascript" />
                            </box>
                            <divider />
                            <box>
                                {parsed}
                            </box>
                        </hstack>
                        {action ? (
                            <>
                                <divider />
                                <box>
                                    <box><text>action dispatched:</text></box>
                                    <codeblock content={action} syntax="javascript" />
                                </box>
                            </>
                        ) : null}
                    </vstack>
                </box>
            </block>
        );
    }
})


export default createIntegration({
    components: [previewBlock]
});
