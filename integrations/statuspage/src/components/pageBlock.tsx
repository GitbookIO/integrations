import { createComponent } from '@gitbook/runtime';

import {
    statuspageAPI,
    StatuspageComponentObject,
    StatuspageIncidentObject,
    StatuspagePageObject,
} from '../api';
import { StatuspageRuntimeContext } from '../configuration';
import { pageOverviewModal } from './pageOverviewModal';
import { subscribeModal } from './subscribeModal';
import { getTitleForStatus, getTitleForIncidentStatus, getTitleForIncidentImpact } from './utils';

export const pageBlock = createComponent<{}, {}, void, StatuspageRuntimeContext>({
    componentId: 'page',
    async render(element, context) {
        const { page_id } = context.environment.spaceInstallation?.configuration || {};

        if (!page_id) {
            return (
                <block>
                    <card
                        title="Configure the Statuspage integration"
                        onPress={{
                            action: '@ui.url.open',
                            url: context.environment.integration.urls.app,
                        }}
                    />
                </block>
            );
        }

        const [page, components, incidents] = await Promise.all([
            statuspageAPI<StatuspagePageObject>(context, {
                method: 'GET',
                path: `pages/${page_id}`,
            }),
            statuspageAPI<StatuspageComponentObject[]>(context, {
                method: 'GET',
                path: `pages/${page_id}/components`,
            }),
            statuspageAPI<StatuspageIncidentObject[]>(context, {
                method: 'GET',
                path: `pages/${page_id}/incidents/unresolved`,
            }),
        ]);

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
                        {incidents.map((incident, index) => (
                            <>
                                <text style="bold">
                                    {getTitleForIncidentImpact(incident.impact)}, {incident.name}
                                </text>
                                {incident.incident_updates.length ? (
                                    <text>
                                        <text style="bold">
                                            {getTitleForIncidentStatus(
                                                incident.incident_updates[0].status
                                            )}
                                        </text>
                                        <text> - {incident.incident_updates[0].body}</text>
                                    </text>
                                ) : null}
                                {index < incidents.length - 1 ? <divider /> : null}
                            </>
                        ))}
                    </vstack>
                </card>
            </block>
        );
    },
});
