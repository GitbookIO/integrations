import { createComponent } from '@gitbook/runtime';

import { statuspageAPI, StatuspageComponentObject, StatuspagePageObject } from '../api';
import { StatuspageRuntimeContext } from '../configuration';
import { pageOverviewModal } from './pageOverviewModal';
import { subscribeModal } from './subscribeModal';

export const pageBlock = createComponent<{}, {}, void, StatuspageRuntimeContext>({
    componentId: 'page',
    async render(element, context) {
        const { page_id } = context.environment.spaceInstallation?.configuration || {};

        if (!page_id) {
            return (
                <block>
                    <card title="Finish configuring the Statuspage integration" />
                </block>
            );
        }

        const page = await statuspageAPI<StatuspagePageObject>(context, {
            method: 'GET',
            path: `pages/${page_id}`,
        });

        const components = await statuspageAPI<StatuspageComponentObject[]>(context, {
            method: 'GET',
            path: `pages/${page_id}/components`,
        });

        const degradedComponent = components.find(
            (component) => component.status !== 'operational'
        );

        return (
            <block>
                <card
                    title={`${page.name} - ${
                        degradedComponent
                            ? getTitleForStatus(degradedComponent.status)
                            : 'All Systems Operational'
                    }`}
                    hint={page.page_description}
                    onPress={{
                        action: '@ui.modal.open',
                        componentId: pageOverviewModal.componentId,
                        props: {},
                    }}
                    buttons={[
                        <button
                            label="Subscribe"
                            onPress={{
                                action: '@ui.modal.open',
                                componentId: subscribeModal.componentId,
                                props: {},
                            }}
                        />,
                    ]}
                >
                    <vstack>
                        {components.map((component) => (
                            <block>
                                <text>
                                    <text style="bold">{component.name}: </text>
                                    <text>{getTitleForStatus(component.status)}</text>
                                </text>
                                <divider />
                                <text>{component.description}</text>
                            </block>
                        ))}
                    </vstack>
                </card>
            </block>
        );
    },
});

function getTitleForStatus(status: StatuspageComponentObject['status']): string {
    switch (status) {
        case 'operational':
            return 'All Systems Operational';
        case 'degraded_performance':
            return 'Degraded Performance';
        case 'partial_outage':
            return 'Partial Outage';
        case 'major_outage':
            return 'Major Outage';
        default:
            return 'Unknown Status';
    }
}
