import { createComponent, ExposableError } from '@gitbook/runtime';
import { IntegrationInstallationConfiguration, ContentKitIcon } from '@gitbook/api';
import {
    AVAILABLE_EVENTS,
    DEFAULT_EVENTS,
    EVENT_DESCRIPTIONS,
    EventType,
    WebhookRuntimeContext,
    WebhookState,
} from './common';

type WebhookProps = {
    installation: {
        configuration?: IntegrationInstallationConfiguration;
    };
    spaceInstallation?: {
        configuration?: {
            webhook_url: string;
            events: Record<EventType, boolean>;
            secret: string;
        };
    };
};

type WebhookAction = { action: 'save.config' };

export const configComponent = createComponent<
    WebhookProps,
    WebhookState,
    WebhookAction,
    WebhookRuntimeContext
>({
    componentId: 'config',
    initialState: (props) => {
        const spaceInstallation = props.spaceInstallation;
        return {
            webhook_url: spaceInstallation?.configuration?.webhook_url || '',
            events: spaceInstallation?.configuration?.events || DEFAULT_EVENTS,
            secret: spaceInstallation?.configuration?.secret || crypto.randomUUID(),
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'save.config': {
                const { api, environment } = context;
                const spaceInstallation = environment.spaceInstallation!;
                const webhookUrl = element.state.webhook_url?.trim() || '';

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
                const hasEnabledEvents = Object.values(element.state.events).some(
                    (enabled) => enabled,
                );
                if (!hasEnabledEvents) {
                    throw new ExposableError('At least one event type must be enabled');
                }

                await api.integrations.updateIntegrationSpaceInstallation(
                    spaceInstallation.integration,
                    spaceInstallation.installation,
                    spaceInstallation.space,
                    {
                        configuration: {
                            ...spaceInstallation.configuration,
                            webhook_url: webhookUrl,
                            events: element.state.events,
                            secret: element.state.secret,
                        },
                    },
                );

                return { type: 'complete' };
            }
        }
    },
    render: async (element) => {
        return (
            <configuration>
                <box>
                    <input
                        label="Webhook URL"
                        hint={<text>The URL where the events will be sent.</text>}
                        element={
                            <textinput
                                state="webhook_url"
                                placeholder="https://your-domain.com/webhook"
                            />
                        }
                    />

                    <divider size="medium" />

                    <text>Select which events you want to receive:</text>

                    {Object.values(EventType).map((eventType) => (
                        <input
                            label={AVAILABLE_EVENTS[eventType]}
                            hint={<text>{EVENT_DESCRIPTIONS[eventType]}</text>}
                            element={<switch state={`events.${eventType}`} />}
                        />
                    ))}

                    <divider size="medium" />

                    <markdown content="### Webhook Secret" />
                    <text>Copy this secret to your webhook endpoint for HMAC verification:</text>
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
                </box>
            </configuration>
        );
    },
});
