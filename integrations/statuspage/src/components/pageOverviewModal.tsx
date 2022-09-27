import { createComponent } from '@gitbook/runtime';
import { statuspageAPI, StatuspageComponentObject } from '../api';
import { StatuspageRuntimeContext } from '../configuration';

export const pageOverviewModal = createComponent<{}, {}, void, StatuspageRuntimeContext>({
    componentId: 'pageOverviewModal',
    initialState: {},
    async render(element, context) {
        const { page_id } = context.environment.spaceInstallation?.configuration || {};
        const components = await statuspageAPI<StatuspageComponentObject[]>(context, {
            method: 'GET',
            path: `pages/${page_id}/components`,
        });

        return (
            <modal title="Status overview">
                <vstack>
                    {components.map((component) => (
                        <box>
                            <card title={component.name} />
                        </box>
                    ))}
                </vstack>
            </modal>
        );
    },
});
