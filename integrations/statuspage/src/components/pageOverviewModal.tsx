import { createComponent } from '@gitbook/runtime';

import {
    statuspageAPI,
    StatuspageComponentGroupObject,
    StatuspageComponentObject,
    StatuspageIncidentObject,
    StatuspagePageObject,
} from '../api';
import { StatuspageRuntimeContext } from '../configuration';
import { getTitleForIncidentImpact, getTitleForIncidentStatus, getTitleForStatus } from './utils';

export const pageOverviewModal = createComponent<{}, {}, void, StatuspageRuntimeContext>({
    componentId: 'pageOverviewModal',
    initialState: {},
    async render(element, context) {
        const { page_id } = context.environment.spaceInstallation?.configuration || {};

        const [page, components, groups, incidents] = await Promise.all([
            statuspageAPI<StatuspagePageObject>(context, {
                method: 'GET',
                path: `pages/${page_id}`,
            }),
            statuspageAPI<StatuspageComponentObject[]>(context, {
                method: 'GET',
                path: `pages/${page_id}/components`,
            }),
            statuspageAPI<StatuspageComponentGroupObject[]>(context, {
                method: 'GET',
                path: `pages/${page_id}/component-groups`,
            }),
            statuspageAPI<StatuspageIncidentObject[]>(context, {
                method: 'GET',
                path: `pages/${page_id}/incidents/unresolved`,
            }),
        ]);

        // Process all the root elements to make sure we properly display the groups and lines of
        // the status page. We'll get all the groups plus their internal components and all the root
        // components. Also sort by their position from the API, so it shows up like on the status
        // page.
        const rootElements: (
            | StatuspageComponentObject
            | (Omit<StatuspageComponentGroupObject, 'components'> & {
                  components: StatuspageComponentObject[];
              })
        )[] = components
            .filter((component) => component.group_id === null)
            .map((component) => {
                if (component.group) {
                    const found = groups.find((group) => group.id === component.id);
                    return {
                        ...found,
                        components: components.filter(
                            (component) => component.group_id === found.id
                        ),
                    };
                }

                return component;
            })
            .sort((el1, el2) => el1.position - el2.position);

        return (
            <modal title="Status overview" size="fullscreen">
                {incidents.length ? (
                    <card title="Current incidents">
                        <vstack>
                            {incidents.map((incident, index) => (
                                <>
                                    <text style="bold">
                                        {getTitleForIncidentImpact(incident.impact)},{' '}
                                        {incident.name}
                                    </text>
                                    <vstack>
                                        {incident.incident_updates.map((update) => (
                                            <text>
                                                <text style="bold">
                                                    {getTitleForIncidentStatus(update.status)}
                                                </text>
                                                <text> - {update.body}</text>
                                            </text>
                                        ))}
                                    </vstack>
                                    {index < incidents.length - 1 ? <divider /> : null}
                                </>
                            ))}
                        </vstack>
                    </card>
                ) : null}
                <card title="About this site" hint={page.page_description}>
                    <vstack>
                        {rootElements.map((element, index) => (
                            <>
                                <hstack>
                                    <text>
                                        <text style="bold">{element.name}</text>
                                        {(element as StatuspageComponentObject).status ? (
                                            <text>
                                                {' '}
                                                -{' '}
                                                {getTitleForStatus(
                                                    (element as StatuspageComponentObject).status
                                                )}
                                            </text>
                                        ) : null}
                                    </text>
                                </hstack>
                                {element.description ? (
                                    <text style="italic">{element.description}</text>
                                ) : null}
                                {(element as { components: StatuspageComponentObject[] })
                                    .components ? (
                                    <vstack>
                                        {(
                                            element as { components: StatuspageComponentObject[] }
                                        ).components.map((element, index) => (
                                            <>
                                                <hstack>
                                                    <text>
                                                        <text style="bold">
                                                            {'  '}
                                                            {element.name}
                                                        </text>
                                                        {element.status ? (
                                                            <text>
                                                                {' '}
                                                                -{' '}
                                                                {getTitleForStatus(element.status)}
                                                            </text>
                                                        ) : null}
                                                    </text>
                                                </hstack>
                                                {element.description ? (
                                                    <text style="italic">
                                                        {'  '}
                                                        {element.description}
                                                    </text>
                                                ) : null}
                                            </>
                                        ))}
                                    </vstack>
                                ) : null}
                                {index < rootElements.length - 1 ? <divider /> : null}
                            </>
                        ))}
                    </vstack>
                </card>
            </modal>
        );
    },
});
