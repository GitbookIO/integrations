import { createIntegration, createComponent, RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

import { handleSubmit } from './utils';

type FormspreeConfiguration = {
    formspree_id: string;
    email: string;
    name: string;
    message: string;
};

type FormspreeEnvironment = RuntimeEnvironment<FormspreeConfiguration>;
type FormspreeContext = RuntimeContext<FormspreeEnvironment>;

type FormspreeAction = {
    action: 'submit';
};

const formspreeBlock = createComponent<
    {
        
    },
    {formSubmitted: true} | {
        email: string;
        name: string;
        message: string;
        formSubmitted: boolean;
    },
    FormspreeAction,
    FormspreeContext
>({
    componentId: 'formspree',
    initialState: {
        email: '',
        name: '',
        message: '',
        formSubmitted: false,
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'submit':
                if (element.state.formSubmitted) {
                    return element;
                }

                handleSubmit((context.environment.spaceInstallation?.configuration as FormspreeConfiguration).formspree_id, {
                    email: element.state.email,
                    name: element.state.name,
                    message: element.state.message,
                });
                return {
                    state: {
                        formSubmitted: true,
                    },
                };
        }
    },
    render: async (element, context: FormspreeContext) => {
        const configuration = context.environment.spaceInstallation?.configuration as FormspreeConfiguration;

        return (
            <block>
                <hstack>
                    {/* Email */}
                    {configuration.email ? (
                        <box grow={1}>
                            <input
                                label="Email"
                                element={<textinput state="email" placeholder="Your email" />}
                            />
                        </box>
                    ) : null}

                    {/* Name */}
                    {configuration.name ? (
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
                    {configuration.message ? (
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
