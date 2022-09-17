import { createComponent } from '@gitbook/runtime';

interface SegmentConfiguration {
    write_key?: string;
}

export const SpaceConfiguration = createComponent<
    {
        configuration: SegmentConfiguration;
    },
    {
        write_key: string;
    },
    {
        type: 'save';
    }
>({
    componentId: 'SpaceConfiguration',
    initialState: {
        write_key: '',
    },
    render: async ({ state }) => {
        //

        return (
            <vstack>
                <box>
                    <textinput label="Write key" initialValue={state.write_key} />
                </box>
            </vstack>
        );
    },
});
