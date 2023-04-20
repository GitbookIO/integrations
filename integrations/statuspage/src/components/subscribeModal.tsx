import { createComponent } from '@gitbook/runtime';

import { statuspageAPI, StatuspageComponentObject, StatuspagePageObject } from '../api';
import { StatuspageRuntimeContext } from '../configuration';

export const subscribeModal = createComponent<
    {},
    {
        subscribed: boolean;
        email: string;
        components: string[];
    },
    {
        action: 'subscribe';
    },
    StatuspageRuntimeContext
>({
    componentId: 'subscribeModal',
    initialState: {
        subscribed: false,
        email: '',
        components: ['all'],
    },
    async action(element, action, context) {
        const { page_id } = context.environment.spaceInstallation?.configuration || {};

        switch (action.action) {
            case 'subscribe': {
                await statuspageAPI<StatuspageComponentObject[]>(context, {
                    method: 'POST',
                    path: `pages/${page_id}/subscribers`,
                    payload: {
                        subscriber: {
                            email: element.state.email,
                            ...(element.state.components.length === 1 &&
                            element.state.components[0] === 'all'
                                ? {}
                                : {
                                      component_ids: element.state.components,
                                  }),
                        },
                    },
                });

                return { state: { subscribed: true, email: '', components: [] } };
            }
        }

        return {};
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

        if (element.state.subscribed) {
            return (
                <modal title="Subscribed!">
                    <text>
                        You are now subscribed to {page.name}. Check your emails to follow the
                        confirmation link.
                    </text>
                </modal>
            );
        }

        return (
            <modal
                title="Subscribe to updates"
                submit={
                    <button
                        onPress={{
                            action: 'subscribe',
                        }}
                        label="Subscribe"
                    />
                }
            >
                <text>
                    Get email notifications whenever {page.name} <text style="bold">creates</text>,{' '}
                    <text style="bold">updates</text> or <text style="bold">resolves</text> an
                    incident.
                </text>
                <input
                    label="Email address"
                    element={<textinput state="email" placeholder="name@domain.com" />}
                />
                <divider />
                <input
                    label="All components"
                    hint="Subscribe to incidents in all components."
                    element={<checkbox state="components" value="all" />}
                />
                {components
                    .filter((component) => !component.group)
                    .map((component) => (
                        <input
                            label={component.name}
                            hint={component.description}
                            element={<checkbox state="components" value={component.id} />}
                        />
                    ))}
            </modal>
        );
    },
});
