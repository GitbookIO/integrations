import { createComponent } from '@gitbook/runtime';
import { statuspageAPI, StatuspageComponentObject } from '../api';
import { StatuspageRuntimeContext } from '../configuration';

export const subscribeModal = createComponent<
    {},
    {
        email: string;
    },
    void,
    StatuspageRuntimeContext
>({
    componentId: 'subscribeModal',
    initialState: {
        email: '',
    },
    async render(element, context) {
        const { page_id } = context.environment.spaceInstallation?.configuration || {};
        const components = await statuspageAPI<StatuspageComponentObject[]>(context, {
            method: 'GET',
            path: `pages/${page_id}/components`,
        });

        return (
            <modal
                title="Subscribe to updates"
                submit={
                    <button
                        onPress={{
                            action: 'subscribe',
                            email: element.dynamicState('email'),
                            components: element.dynamicState('components'),
                        }}
                        label="Subscribe"
                    />
                }
            >
                <text>
                    Enter your email address to receive updates about updates in the status page.
                </text>
                <divider />
                <input
                    label="Email"
                    hint="You'll receive a confirmation email."
                    element={
                        <textinput label="Email" state="email" placeholder="name@domain.com" />
                    }
                />
                <divider />
                {components.map((component) => (
                    <input
                        label={component.name}
                        hint={components.description}
                        element={<checkbox state="components" value={component.id} />}
                    />
                ))}
            </modal>
        );
    },
});
