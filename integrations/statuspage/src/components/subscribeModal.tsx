import { createComponent } from '@gitbook/runtime';
import { statuspageAPI, StatuspageComponentObject, StatuspagePageObject } from '../api';
import { StatuspageRuntimeContext } from '../configuration';

export const subscribeModal = createComponent<
    {},
    {
        email: string;
        components: string[];
    },
    void,
    StatuspageRuntimeContext
>({
    componentId: 'subscribeModal',
    initialState: {
        email: '',
        components: ['all'],
    },
    async render(element, context) {
        const { page_id } = context.environment.spaceInstallation?.configuration || {};
        const [components, page] = await Promise.all([
            statuspageAPI<StatuspageComponentObject[]>(context, {
                method: 'GET',
                path: `pages/${page_id}/components`,
            }),
            statuspageAPI<StatuspagePageObject>(context, {
                method: 'GET',
                path: `pages/${page_id}`,
            }),
        ]);

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
                    Get email notifications whenever {page.name} creates, updates or resolves an
                    incident.
                </text>
                <input
                    label="Email address"
                    hint="You'll receive a confirmation email."
                    element={
                        <textinput label="Email" state="email" placeholder="name@domain.com" />
                    }
                />
                <divider />
                <input
                    label="All components"
                    hint="Subscribe to incidents in all components."
                    element={<checkbox state="components" value="all" />}
                />
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
