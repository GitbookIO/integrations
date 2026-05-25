import { createComponent, ExposableError } from '@gitbook/runtime';
import {
    LaunchDarklyAction,
    LaunchDarklyProps,
    LaunchDarklyRuntimeContext,
    LaunchDarklySiteInstallationConfiguration,
    LaunchDarklyState,
} from './types';
import { assertInstallation, assertSiteInstallation } from './utils';
import { GitBookAPI } from '@gitbook/api';

export const configBlock = createComponent<
    LaunchDarklyProps,
    LaunchDarklyState,
    LaunchDarklyAction,
    LaunchDarklyRuntimeContext
>({
    componentId: 'config',
    initialState: (props) => {
        const siteInstallation = props.siteInstallation;
        return {
            project_key: siteInstallation.configuration?.project_key || '',
            service_token: siteInstallation.configuration?.service_token || '',
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'save.config':
                const { api, environment } = context;

                const siteInstallation = assertSiteInstallation(environment);

                const projectKey = element.state.project_key;
                if (typeof projectKey !== 'string' || !projectKey) {
                    throw new ExposableError(
                        'Incomplete configuration: missing LaunchDarkly project key',
                    );
                }

                const serviceToken = element.state.service_token;
                if (typeof serviceToken !== 'string' || !serviceToken) {
                    throw new ExposableError(
                        'Incomplete configuration: missing LaunchDarkly service token',
                    );
                }

                const configurationBody: LaunchDarklySiteInstallationConfiguration = {
                    project_key: projectKey,
                    service_token: serviceToken,
                };

                await api.integrations.updateIntegrationSiteInstallation(
                    siteInstallation.integration,
                    siteInstallation.installation,
                    siteInstallation.site,
                    {
                        configuration: {
                            ...configurationBody,
                        },
                    },
                );

                return { type: 'complete' };
        }
    },
    render: async (element, context) => {
        const installation = assertInstallation(context.environment);
        const siteInstallation = assertSiteInstallation(context.environment);
        const installationAPIToken = context.environment.apiTokens.installation;

        if (!installationAPIToken) {
            throw new Error(`Expected installation API token to be set in the environment`);
        }

        const api = new GitBookAPI({
            userAgent: context.api.userAgent,
            endpoint: context.environment.apiEndpoint,
            authToken: installationAPIToken,
        });

        const { data: site } = await api.orgs.getSiteById(
            installation.target.organization,
            siteInstallation.site,
        );
        const isAdaptiveContentEnabled = Boolean(site.adaptiveContent?.enabled);
        return (
            <configuration>
                {isAdaptiveContentEnabled ? (
                    <box>
                        <vstack>
                            <input
                                label="Project key"
                                hint={
                                    <text>
                                        The project key of your LaunchDarkly{' '}
                                        <link
                                            target={{
                                                url: 'https://app.launchdarkly.com/settings/projects',
                                            }}
                                        >
                                            environment.
                                        </link>
                                    </text>
                                }
                                element={
                                    <textinput state="project_key" placeholder="Project key" />
                                }
                            />
                            <input
                                label="Service access token"
                                hint={
                                    <text>
                                        A service token with reader role created in your
                                        LaunchDarkly{' '}
                                        <link
                                            target={{
                                                url: 'https://app.launchdarkly.com/settings/authorization',
                                            }}
                                        >
                                            project.
                                        </link>
                                    </text>
                                }
                                element={
                                    <textinput
                                        state="service_token"
                                        placeholder="Service access token"
                                    />
                                }
                            />
                            <input
                                label=""
                                hint=""
                                element={
                                    <button
                                        style="primary"
                                        disabled={false}
                                        label="Save"
                                        tooltip="Save configuration"
                                        onPress={{
                                            action: 'save.config',
                                        }}
                                    />
                                }
                            />
                        </vstack>
                    </box>
                ) : (
                    <input
                        label="Enable Adaptive Content"
                        hint="To use LaunchDarkly, you need to enable Adaptive Content in your site audience settings."
                        element={
                            <button
                                label="Enable"
                                onPress={{
                                    action: '@ui.url.open',
                                    url: `${site.urls.app}/settings/audience`,
                                }}
                            />
                        }
                    />
                )}
            </configuration>
        );
    },
});
