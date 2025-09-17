import { createComponent, ExposableError } from '@gitbook/runtime';
import { IntegrationInstallationConfiguration } from '@gitbook/api';
import {
    AVAILABLE_EVENTS,
    EVENT_TYPES,
    EventType,
    WebhookRuntimeContext,
    WebhookState,
} from './common';
import { handleWebhookEvent } from './index';

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

type WebhookAction = { action: 'save.config' } | { action: 'test.webhook' };

export const configComponent = createComponent<
    WebhookProps,
    WebhookState,
    WebhookAction,
    WebhookRuntimeContext
>({
    componentId: 'config',
    initialState: (props) => {
        const spaceInstallation = props.spaceInstallation;
        const existingEvents = spaceInstallation?.configuration?.events;

        const state = {
            webhook_url: spaceInstallation?.configuration?.webhook_url || '',
            secret: spaceInstallation?.configuration?.secret || crypto.randomUUID(),
        } as WebhookState;

        EVENT_TYPES.forEach((eventType) => {
            state[eventType] = existingEvents?.[eventType] ?? false;
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
                            ...spaceInstallation.configuration,
                            webhook_url: webhookUrl,
                            events: Object.fromEntries(
                                EVENT_TYPES.map((eventType) => [
                                    eventType,
                                    element.state[eventType],
                                ]),
                            ),
                            secret: element.state.secret,
                        },
                    },
                );

                return { type: 'complete' };
            }
            case 'test.webhook': {
                const { environment } = context;
                const spaceInstallation = environment.spaceInstallation!;
                const webhookUrl = element.state.webhook_url?.trim();

                if (!webhookUrl) {
                    throw new ExposableError('Webhook URL is required');
                }

                try {
                    await handleWebhookEvent({
                        event: {
                            type: EventType.SPACE_CONTENT_UPDATED,
                            eventId: 'test-event-' + Date.now(),
                            installationId: spaceInstallation.installation,
                            spaceId: spaceInstallation.space,
                            revisionId: 'test-revision-' + Date.now(),
                        },
                        context,
                        webhookUrl,
                        secret: element.state.secret,
                        skipEventTypeCheck: true,
                    });

                    return {
                        state: {
                            ...element.state,
                            testMessage: '✅ Test webhook sent successfully!',
                            testStatus: 'success' as const,
                        },
                    };
                } catch (error) {
                    return {
                        state: {
                            ...element.state,
                            testMessage: `❌ Test webhook failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                            testStatus: 'error' as const,
                        },
                    };
                }
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
                <input
                    label=""
                    hint=""
                    element={
                        <button
                            style="secondary"
                            label="Test Webhook"
                            tooltip="Send a test webhook to verify your configuration"
                            onPress={{
                                action: 'test.webhook',
                            }}
                        />
                    }
                />

                {element.state.testMessage ? (
                    <hstack align="center">
                        <text>{element.state.testMessage}</text>
                    </hstack>
                ) : null}

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
