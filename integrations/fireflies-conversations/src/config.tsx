import { createComponent, InstallationConfigurationProps } from '@gitbook/runtime';
import { FirefliesRuntimeContext, FirefliesRuntimeEnvironment } from './types';

type FirefliesConfigState = {
    api_key: string;
};

type FirefliesConfigAction = { action: 'save.config' };

/**
 * Configuration component for the Fireflies integration.
 */
export const configComponent = createComponent<
    InstallationConfigurationProps<FirefliesRuntimeEnvironment>,
    FirefliesConfigState,
    FirefliesConfigAction,
    FirefliesRuntimeContext
>({
    componentId: 'config',
    initialState: (props) => {
        const installation = props.installation;
        return {
            api_key: installation.configuration?.api_key || '',
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'save.config':
                const { api, environment } = context;
                const { installation } = environment;

                if (!installation) {
                    return { type: 'complete' };
                }

                const configurationBody = {
                    ...installation.configuration,
                    api_key: element.state.api_key,
                };

                await api.integrations.updateIntegrationInstallation(
                    environment.integration.name,
                    installation.id,
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
        const { installation } = context.environment;
        if (!installation) {
            return null;
        }

        const hasApiKey = !!element.props.installation.configuration?.api_key;

        return (
            <configuration>
                <input
                    label="Fireflies API Key"
                    hint={
                        'Enter your Fireflies API key. You can find this in your Fireflies account settings.'
                    }
                    element={
                        <textinput state="api_key" placeholder="Enter your Fireflies API key" />
                    }
                />

                <button
                    label={hasApiKey ? 'Update API Key' : 'Save API Key'}
                    onPress={{
                        action: 'save.config',
                    }}
                />

                {hasApiKey ? (
                    <hint>
                        <text>
                            The integration is configured and transcripts are being ingested.
                        </text>
                    </hint>
                ) : (
                    <hint>
                        <text>Please enter your Fireflies API key to enable the integration.</text>
                    </hint>
                )}
            </configuration>
        );
    },
});
