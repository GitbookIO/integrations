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
        emailVisible: true,
        nameVisible: false,
        messageVisible: false,
        formSubmitted: false,
    },
    action: async (element, action: FormspreeAction, context: FormspreeContext) => {
        switch (action.action) {
            case 'submit':
                handleSubmit(context.environment.spaceInstallation?.configuration.formspree_id, {
                    email: element.state.email,
                    name: element.state.name,
                    message: element.state.message,
                });
                return {
                    state: {
                        formSubmitted: true,
                        ...element.state,
                    },
                };
            case 'toggleEmail': {
                return { state: { emailVisible: !element.state.emailVisible, ...element.state } };
            }
            case 'toggleName': {
                return { state: { nameVisible: !element.state.nameVisible, ...element.state } };
            }
            case 'toggleMessage': {
                return {
                    state: { messageVisible: !element.state.messageVisible, ...element.state },
                };
            }
        }
    },
    render: async (element, context: FormspreeContext) => {
        return (
            <block
                controls={[
                    {
                        label: 'Toggle Email',
                        onPress: {
                            action: 'toggleEmail',
                        },
                    },
                    {
                        label: 'Toggle Name',
                        onPress: {
                            action: 'toggleName',
                        },
                    },
                    {
                        label: 'Toggle Messsage',
                        onPress: {
                            action: 'toggleMessage',
                        },
                    },
                ]}
            >
                <hstack>
                    {/* Email */}
                    {element.state.emailVisible ? (
                        <box grow={1}>
                            <input
                                label="Email"
                                element={<textinput state="email" placeholder="Your email" />}
                            />
                        </box>
                    ) : null}

                    {/* Name */}
                    {element.state.nameVisible ? (
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
                    {element.state.messageVisible ? (
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
