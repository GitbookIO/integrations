import {
    createComponent,
    createIntegration,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

interface MailchimpInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
    };
}

type MailchimpRuntimeEnvironment = RuntimeEnvironment<MailchimpInstallationConfiguration>;
type MailchimpRuntimeContext = RuntimeContext<MailchimpRuntimeEnvironment>;

type MailchimpBlockProps = {
    email?: string;
};

type MailchimpBlockState = {
    editMode?: boolean;
};

const subscribeComponent = createComponent<MailchimpBlockProps, MailchimpBlockState>({
    componentId: 'subscribe',

    async action(element, action) {
        switch (action.action) {
            case 'toggleEditMode': {
                return {
                    state: {
                        editMode: !element.state.editMode,
                    },
                };
            }
            case '@ui.subscribe': {
                const { email } = element.props;

                return {
                    props: {
                        email,
                    },
                };
            }
        }

        return element;
    },

    async render(element, context) {
        const { editMode = false } = element.state;

        return (
            <block>
                <card title={'Subscribe to our newsletter'}>
                    {editMode ? (
                        <hstack>
                            <box>
                                <text>Edit mode</text>
                            </box>
                            <box>
                                <button label="Done" onPress={{ action: 'toggleEditMode' }} />
                            </box>
                        </hstack>
                    ) : (
                        <hstack>
                            <box>
                                <textinput
                                    state="email"
                                    initialValue=""
                                    placeholder="Enter your email!!!"
                                />
                            </box>
                            <box>
                                <button
                                    label="Subscribe"
                                    onPress={{
                                        action: '@ui.subscribe',
                                    }}
                                />
                            </box>
                            {element.context.editable ? (
                                <box>
                                    <button
                                        label="Make changes"
                                        onPress={{ action: 'toggleEditMode' }}
                                    />
                                </box>
                            ) : null}
                        </hstack>
                    )}
                </card>
            </block>
        );
    },
});

export default createIntegration<MailchimpRuntimeContext>({
    components: [subscribeComponent],
});

/**
 * 
                        <textinput
                            id="email"
                            label="Email"
                            initialValue=""
                            placeholder="Enter your email"
                        />
                        <button
                            icon="maximize"
                            label="Subscribe"
                            tooltip="Subscribe"
                            onPress={{
                                action: '@ui.subscribe',
                            }}
                        />
 */
