import { createIntegration, createComponent } from '@gitbook/runtime';

import { saveSpaceConfiguration, handleSubmit } from './utils';

type FormspreeContext = {
    environment: {
        spaceInstallation: {
            configuration: {
                formspree_id: string;
                email: string;
                name: string;
                message: string;
                emailVisible?: boolean;
                nameVisible?: boolean;
                messageVisible?: boolean;
            };
        };
    };
};

type FormspreeAction = {
    action: any;
};

const formspreeBlock = createComponent({
    componentId: 'formspree',
    initialState: (props: any) => {
        console.log('PROPS on create component: ', props);
        return {
            email: '',
            name: '',
            message: '',
            emailVisible: props.spaceInstallation?.configuration?.emailVisible || true,
            nameVisible: props.spaceInstallation?.configuration?.nameVisibile || false,
            messageVisible: props.spaceInstallation?.configuration?.messageVisible || false,
            formSubmitted: false,
        };
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
                const emailToggle =
                    !context.environment.spaceInstallation.configuration.emailVisible;
                await saveSpaceConfiguration(context, {
                    ...element.state,
                    emailVisible: emailToggle,
                });
                return element;
            }
            case 'toggleName': {
                const nameToggle = !context.environment.spaceInstallation.configuration.nameVisible;
                await saveSpaceConfiguration(context, {
                    ...element.state,
                    nameVisible: nameToggle,
                });
                return element;
            }
            case 'toggleMessage': {
                const messageToggle =
                    !context.environment.spaceInstallation.configuration.messageVisible;
                await saveSpaceConfiguration(context, {
                    ...element.state,
                    messageVisible: messageToggle,
                });
                return element;
            }
        }
    },
    render: async (element, context: FormspreeContext) => {
        const spaceInstallationConfigration = context.environment.spaceInstallation.configuration;

        console.log('Rendering State: ', element.state);
        console.log('Rendering Configuration: ', spaceInstallationConfigration);
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
                    {spaceInstallationConfigration?.emailVisible ? (
                        <box grow={1}>
                            <input
                                label="Email"
                                element={<textinput state="email" placeholder="Your email" />}
                            />
                        </box>
                    ) : null}

                    {/* Name */}
                    {spaceInstallationConfigration?.nameVisible ? (
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
                    {spaceInstallationConfigration?.messageVisible ? (
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
