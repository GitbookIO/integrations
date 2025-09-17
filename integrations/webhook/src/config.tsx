import { createComponent, ExposableError } from '@gitbook/runtime';
import { IntegrationInstallationConfiguration } from '@gitbook/api';
import {
    AVAILABLE_EVENTS,
    EVENT_TYPES,
    WebhookRuntimeContext,
    WebhookConfiguration,
} from './common';

type WebhookProps = {
    installation: {
        configuration?: IntegrationInstallationConfiguration;
    };
    spaceInstallation?: {
        configuration?: WebhookConfiguration;
    };
};

type WebhookAction = { action: 'save.config' };

export const configComponent = createComponent<
    WebhookProps,
    WebhookConfiguration,
    WebhookAction,
    WebhookRuntimeContext
>({
    componentId: 'config',
    initialState: (props) => {
        const spaceInstallation = props.spaceInstallation;
        const state = {
            webhook_url: spaceInstallation?.configuration?.webhook_url || '',
            secret: spaceInstallation?.configuration?.secret || crypto.randomUUID(),
        } as WebhookConfiguration;

        EVENT_TYPES.forEach((eventType) => {
            state[eventType] = spaceInstallation?.configuration?.[eventType] ?? false;
        });

        return state;
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
                const hasEnabledEvents = EVENT_TYPES.some((eventType) => element.state[eventType]);
                if (!hasEnabledEvents) {
                    throw new ExposableError('At least one event type must be enabled');
                }

                await api.integrations.updateIntegrationSpaceInstallation(
                    spaceInstallation.integration,
                    spaceInstallation.installation,
                    spaceInstallation.space,
                    {
                        configuration: {
                            webhook_url: webhookUrl,
                            secret: element.state.secret,
                            ...Object.fromEntries(
                                EVENT_TYPES.map((eventType) => [
                                    eventType,
                                    element.state[eventType],
                                ]),
                            ),
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

                {EVENT_TYPES.map((eventType) => (
                    <input
                        label={AVAILABLE_EVENTS[eventType]}
                        element={<switch state={eventType} />}
                    />
                ))}

                <divider size="medium" />

                <markdown content="### Secret" />
                <text>
                    You can copy and verify this secret in your webhook for HMAC verification:
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
