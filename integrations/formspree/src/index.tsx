import { createIntegration, createComponent } from '@gitbook/runtime';

import { handleSubmit } from './utils';

type FormspreeContext = {
    environment: {
        spaceInstallation: {
            configuration: {
                formspree_id: string;
                email: string;
                name: string;
                message: string;
            };
        };
    };
};

type FormspreeAction = {
    action: any;
};

const formspreeBlock = createComponent({
    componentId: 'formspree',
    initialState: {
        email: '',
        name: '',
        message: '',
        formSubmitted: false,
    },
    action: async (element, action: FormspreeAction, context: FormspreeContext) => {
        switch (action.action) {
            case 'submit':
                handleSubmit(
                    context.environment.spaceInstallation?.configuration.formspree_id,
                    element.state
                );
                return {
                    state: {
                        formSubmitted: true,
                    },
                };
        }
    },
    render: async (element, context: FormspreeContext) => {
        return (
            <block>
                <hstack>
                    {/* Email */}
                    {context.environment.spaceInstallation?.configuration.email ? (
                        <box grow={1}>
                            <input
                                label="Email"
                                element={<textinput state="email" placeholder="Your email" />}
                            />
                        </box>
                    ) : null}

                    {/* Name */}
                    {context.environment.spaceInstallation?.configuration.name ? (
                        <box grow={1}>
                            <input
                                label="Name"
                                element={<textinput state="name" placeholder="Your name" />}
                            />
                        </box>
                    ) : null}
                </hstack>

                <vstack>
                    {/* Message */}
                    {context.environment.spaceInstallation?.configuration.message ? (
                        <box grow={2}>
                            <input
                                label="Message"
                                element={
                                    <textinput
                                        state="message"
                                        placeholder="Your message"
                                        multiline={true}
                                    />
                                }
                            />
                        </box>
                    ) : null}
                </vstack>

                <button
                    label={element.state.formSubmitted ? 'Submitted' : 'Submit'}
                    onPress={{ action: 'submit' }}
                    disabled={element.state.formSubmitted}
                />
            </block>
        );
    },
});

export default createIntegration({
    components: [formspreeBlock],
});
