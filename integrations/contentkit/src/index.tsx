import { createIntegration, createComponent } from "@gitbook/runtime";

const previewBlock = createComponent<{
    content: string;
}>({
    componentId: 'preview',
    initialState: {},
    async render({ props }) {
        const { content } = props;

        return (
            <block>
                <box>
                    <text>Hello world</text>
                </box>
                <box>
                    <text>{content}</text>
                </box>
            </block>
        )

        const parsed = JSON.parse(content);
        return <block>{parsed}</block>;
    }
})


export default createIntegration({
    components: [previewBlock]
});