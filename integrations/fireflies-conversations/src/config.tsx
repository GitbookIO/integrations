import { createComponent, InstallationConfigurationProps } from '@gitbook/runtime';
import { FirefliesRuntimeContext, FirefliesRuntimeEnvironment } from './types';

type FirefliesConfigState = {
    api_key: string;
    webhook_secret: string;
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
            webhook_secret: installation.configuration?.webhook_secret || '',
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
                    webhook_secret: element.state.webhook_secret,
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
        const hasWebhookSecret = !!element.props.installation.configuration?.webhook_secret;

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

                <input
                    label="Webhook Secret"
                    hint={
                        'Enter your Fireflies webhook secret for verifying webhook requests. You can find or generate this in Settings → Developer Settings in your Fireflies dashboard.'
                    }
                    element={
                        <textinput state="webhook_secret" placeholder="Enter your webhook secret" />
                    }
                />

                <button
                    label={hasApiKey ? 'Update Configuration' : 'Save Configuration'}
                    onPress={{
                        action: 'save.config',
                    }}
                />

                {hasApiKey ? (
                    <hint>
                        <text>
                            The integration is configured and transcripts are being ingested.
                            {hasWebhookSecret
                                ? ' Webhook support is enabled for real-time transcript ingestion.'
                                : ' To enable real-time webhook ingestion, add your webhook secret and configure the webhook URL in your Fireflies dashboard.'}
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
