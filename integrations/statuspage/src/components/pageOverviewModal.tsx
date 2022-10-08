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
                {components.map((component) => (
                    <hstack>
                        <box grow={1}>
                            <text>{component.name}</text>
                        </box>
                    </hstack>
                ))}
            </modal>
        );
    },
});
