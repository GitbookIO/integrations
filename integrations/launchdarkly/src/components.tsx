import { createComponent, ExposableError } from '@gitbook/runtime';
import {
    LaunchDarklyAction,
    LaunchDarklyProps,
    LaunchDarklyRuntimeContext,
    LaunchDarklySiteInstallationConfiguration,
    LaunchDarklyState,
} from './types';
import { assertSiteInstallation } from './utils';

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
    render: async () => {
        return (
            <block>
                <input
                    label="Secret key"
                    hint={
                        <text>
                            The secret key from your LaunchDarkly{' '}
                            <link
                                target={{
                                    url: 'https://app.LaunchDarkly.co/envs/current/settings/app-environments',
                                }}
                            >
                                environment settings.
                            </link>
                        </text>
                    }
                    element={<textinput state="secret_key" placeholder="Secret key" />}
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
            </block>
        );
    },
});
