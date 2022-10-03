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
                        }}
                        label="Subscribe"
                    />
                }
            >
                <vstack>
                    <box>
                        <text>
                            Enter your email address to receive updates about updates in the status
                            page.
                        </text>
                    </box>
                    <divider />
                    <box>
                        <input
                            label="Email"
                            hint="You'll receive a confirmation email."
                            element={
                                <textinput
                                    label="Email"
                                    state="email"
                                    placeholder="name@domain.com"
                                />
                            }
                        />
                    </box>
                    <divider />
                    <box>
                        <input
                            label="Components"
                            hint="Select the components you want to receive notifications about."
                            element={
                                <select
                                    state="components"
                                    multiple
                                    initialValue={['']}
                                    options={[
                                        {
                                            id: '',
                                            label: 'All components',
                                        },
                                        ...components.map((component) => ({
                                            id: component.id,
                                            label: component.name,
                                        })),
                                    ]}
                                />
                            }
                        />
                    </box>
                </vstack>
            </modal>
        );
    },
});
