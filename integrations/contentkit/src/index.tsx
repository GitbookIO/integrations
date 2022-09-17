import { createIntegration, createComponent } from "@gitbook/runtime";

const previewBlock = createComponent<{
    content: string;
}>({
    componentId: 'preview',
    initialState: {},
    async render({ props }) {

        return (
            <block>
                <box>
                    <text>Hello world</text>
                </box>
            </block>
        )

        const { content } = props;
        const parsed = JSON.parse(content);
        return <block>{parsed}</block>;
    }
})


export default createIntegration({
    components: [previewBlock]
});