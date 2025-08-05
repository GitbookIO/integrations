import { createIntegration, createComponent } from '@gitbook/runtime';

import { handleSubmit } from './utils';
import type {
    FormspreeActionResponse,
    FormspreeConfiguration,
    FormspreeAction,
    FormspreeContext,
} from './types';

const formspreeBlock = createComponent<
    Record<string, string>,
    FormspreeActionResponse,
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
            case 'submit': {
                if (element.state.formSubmitted) {
                    return element;
                }

                const success = await handleSubmit(
                    (context.environment.spaceInstallation?.configuration as FormspreeConfiguration)
                        .formspree_id,
                    {
                        email: element.state.email,
                        name: element.state.name,
                        message: element.state.message,
                    },
                );

                if (!success) {
                    return element;
                }

                return {
                    state: {
                        formSubmitted: true,
                    },
                };
            }
        }
    },
    render: async (element, context: FormspreeContext) => {
        const configuration = context.environment.spaceInstallation
            ?.configuration as FormspreeConfiguration;

        return (
            <block>
                <hstack>
                    {/* Email */}
                    {configuration.email ? (
                        <box grow={1}>
                            <input
                                label="Email"
                                element={
                                    <textinput
                                        inputType="text"
                                        state="email"
                                        placeholder="Your email"
                                    />
                                }
                            />
                        </box>
                    ) : null}

                    {/* Name */}
                    {configuration.name ? (
                        <box grow={1}>
                            <input
                                label="Name"
                                element={
                                    <textinput
                                        state="name"
                                        placeholder="Your name"
                                        inputType="text"
                                    />
                                }
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
                                        inputType="text"
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
                    style="primary"
                />
            </block>
        );
    },
});

export default createIntegration({
    components: [formspreeBlock],
});
