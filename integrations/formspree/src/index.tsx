import { createIntegration, createComponent } from '@gitbook/runtime';

import { handleSubmit } from './utils';

type FormspreeContext = {
    environment: {
        spaceInstallation: {
            configuration: {
                formspree_id: string;
            };
        };
        installation: {
            configuration: {
                formspree_id: string;
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
        formSubmitted: false,
    },
    action: async (element, action: FormspreeAction, context: FormspreeContext) => {
        switch (action.action) {
            case 'submit':
                handleSubmit(
                    context.environment.spaceInstallation?.configuration.formspree_id ||
                        context.environment.installation.configuration.formspree_id,
                    element.state.email
                );
                return {
                    state: {
                        formSubmitted: true,
                    },
                };
        }
    },
    render: async (element, context) => {
        return (
            <block>
                <input
                    label="Email"
                    element={<textinput state="email" placeholder="Type your email" />}
                />

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
