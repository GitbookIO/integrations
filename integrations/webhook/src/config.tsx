import { createComponent, ExposableError } from '@gitbook/runtime';
import { IntegrationInstallationConfiguration } from '@gitbook/api';
import {
    AVAILABLE_EVENTS,
    EVENT_TYPES,
    WebhookRuntimeContext,
    WebhookConfiguration,
    generateSecret,
} from './common';

export const configComponent = createComponent<
    {
        installation: {
            configuration?: IntegrationInstallationConfiguration;
        };
        spaceInstallation?: {
            configuration?: WebhookConfiguration;
        };
        siteInstallation?: {
            configuration?: WebhookConfiguration;
        };
    },
    WebhookConfiguration,
    {
        action: 'save.config';
    },
    WebhookRuntimeContext
>({
    componentId: 'config',
    initialState: (props) => {
        // Get configuration from whichever installation type is available
        const installation = props.spaceInstallation || props.siteInstallation;

        // For organization-level installations, check the installation configuration
        let config: any;
        if (installation) {
            config = installation.configuration;
        } else if (props.installation) {
            config = props.installation.configuration;
        } else {
            config = {};
        }

        return {
            webhookUrl: config?.webhookUrl || '',
            secret: config?.secret || generateSecret(),
            ...Object.fromEntries(
                EVENT_TYPES.map((eventType) => [eventType, config?.[eventType] ?? false]),
            ),
        } as WebhookConfiguration;
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'save.config': {
                const { api, environment } = context;
                const webhookUrl = element.state.webhookUrl.trim();

                // Validate webhook URL
                if (!webhookUrl) {
                    throw new ExposableError('Webhook URL is required');
                }

                // Very basic URL format validation
                try {
                    new URL(webhookUrl);
                } catch (error) {
                    throw new ExposableError('Please enter a valid webhook URL');
                }

                // Validate that at least one event is enabled
                const hasEnabledEvents = EVENT_TYPES.some((eventType) => element.state[eventType]);
                if (!hasEnabledEvents) {
                    throw new ExposableError('At least one event type must be enabled');
                }

                const configuration = {
                    webhookUrl: webhookUrl,
                    secret: element.state.secret,
                    ...Object.fromEntries(
                        EVENT_TYPES.map((eventType) => [eventType, element.state[eventType]]),
                    ),
                } as WebhookConfiguration;

                // Update the appropriate installation based on what's available
                if (environment.spaceInstallation) {
                    await api.integrations.updateIntegrationSpaceInstallation(
                        environment.spaceInstallation.integration,
                        environment.spaceInstallation.installation,
                        environment.spaceInstallation.space,
                        { configuration },
                    );
                } else if (environment.siteInstallation) {
                    await api.integrations.updateIntegrationSiteInstallation(
                        environment.siteInstallation.integration,
                        environment.siteInstallation.installation,
                        environment.siteInstallation.site,
                        { configuration },
                    );
                } else if (environment.installation) {
                    await api.integrations.updateIntegrationInstallation(
                        environment.integration.name,
                        environment.installation.id,
                        { configuration },
                    );
                } else {
                    throw new ExposableError('No installation found to update');
                }

                return { type: 'complete' };
            }
        }
    },
    render: async (element) => {
        return (
            <configuration>
                <input
                    label="Webhook URL"
                    hint={<text>The URL where the events will be sent.</text>}
                    element={
                        <textinput
                            state="webhookUrl"
                            placeholder="https://your-domain.com/webhook"
                        />
                    }
                />

                <divider size="medium" />

                <text>Select which events you want to receive:</text>

                {EVENT_TYPES.map((eventType) => (
                    <input
                        label={AVAILABLE_EVENTS[eventType]}
                        element={<switch state={eventType} />}
                    />
                ))}

                <divider size="medium" />

                <markdown content="### Secret" />
                <text>
                    Use this secret to verify the GitBook webhook signatures (SHA-256 HMAC).
                </text>
                <text>
                    See our{' '}
                    <link
                        target={{
                            url: 'https://gitbook.com/docs/integrations/webhook#signature-verification-example',
                        }}
                    >
                        documentation
                    </link>{' '}
                    for implementation examples.
                </text>
                <codeblock content={element.state.secret} />

                <divider size="medium" />

                <input
                    label=""
                    hint=""
                    element={
                        <button
                            style="primary"
                            label="Save Configuration"
                            tooltip="Save webhook configuration"
                            onPress={{
                                action: 'save.config',
                            }}
                        />
                    }
                />
            </configuration>
        );
    },
});
