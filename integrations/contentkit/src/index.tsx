import { createIntegration, createComponent } from "@gitbook/runtime";

const previewBlock = createComponent<{
    content: string;
}>({
    componentId: 'preview',
    initialState: {},
    async render({ props }) {
        const { content } = props;

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
                <box style="card">
                    <hstack>
                        <box>
                            <codeblock content={content} syntax="javascript" />
                        </box>
                        <divider />
                        <box>
                            {parsed}
                        </box>
                    </hstack>
                </box>
            </block>
        );
    }
})


export default createIntegration({
    components: [previewBlock]
});