import { createComponent, ExposableError } from '@gitbook/runtime';
import { IntegrationInstallationConfiguration } from '@gitbook/api';
import {
    AVAILABLE_EVENTS,
    EventType,
    WebhookRuntimeContext,
    WebhookConfiguration,
    WebhookAccountConfiguration,
    generateSecret,
} from './common';

export const config = createComponent<
    {
        installation?: {
            configuration?: WebhookAccountConfiguration;
        };
        spaceInstallation?: {
            configuration?: WebhookConfiguration;
        };
        siteInstallation?: {
            configuration?: WebhookConfiguration;
        };
    },
    WebhookAccountConfiguration & {
        [EventType.CONTENT_UPDATED]?: boolean;
        [EventType.SITE_VIEW]?: boolean;
        [EventType.PAGE_FEEDBACK]?: boolean;
    },
    {
        action: 'save.config' | 'regenerate.secret';
    },
    WebhookRuntimeContext
>({
    componentId: 'config',
    initialState: (props, _, context) => {
        // Get account-level configuration (webhookUrl and secret) from environment
        const accountConfig = context.environment.installation?.configuration;

        // Get space/site configuration (event preferences) from props
        const spaceConfig = props.spaceInstallation?.configuration;
        const siteConfig = props.siteInstallation?.configuration;

        return {
            // Account-level config (shared across all installations)
            webhookUrl: accountConfig?.webhookUrl || '',
            secret: accountConfig?.secret || generateSecret(),
            // Space/site-specific event preferences
            [EventType.CONTENT_UPDATED]: spaceConfig?.[EventType.CONTENT_UPDATED] ?? false,
            [EventType.SITE_VIEW]: siteConfig?.[EventType.SITE_VIEW] ?? false,
            [EventType.PAGE_FEEDBACK]: siteConfig?.[EventType.PAGE_FEEDBACK] ?? false,
        };
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

                // Always save account-level configuration (webhookUrl and secret)
                await api.integrations.updateIntegrationInstallation(
                    environment.integration.name,
                    environment.installation!.id,
                    {
                        configuration: {
                            webhookUrl: webhookUrl,
                            secret: element.state.secret,
                        },
                    },
                );

                // Save space/site-specific event preferences if applicable
                if (environment.spaceInstallation) {
                    // Validate that at least one event is enabled for space
                    if (!element.state[EventType.CONTENT_UPDATED]) {
                        throw new ExposableError('At least one event type must be enabled');
                    }

                    await api.integrations.updateIntegrationSpaceInstallation(
                        environment.spaceInstallation.integration,
                        environment.spaceInstallation.installation,
                        environment.spaceInstallation.space,
                        {
                            configuration: {
                                [EventType.CONTENT_UPDATED]:
                                    element.state[EventType.CONTENT_UPDATED],
                            },
                        },
                    );
                } else if (environment.siteInstallation) {
                    // Validate that at least one event is enabled for site
                    if (
                        !element.state[EventType.SITE_VIEW] &&
                        !element.state[EventType.PAGE_FEEDBACK]
                    ) {
                        throw new ExposableError('At least one event type must be enabled');
                    }

                    await api.integrations.updateIntegrationSiteInstallation(
                        environment.siteInstallation.integration,
                        environment.siteInstallation.installation,
                        environment.siteInstallation.site,
                        {
                            configuration: {
                                [EventType.SITE_VIEW]: element.state[EventType.SITE_VIEW],
                                [EventType.PAGE_FEEDBACK]: element.state[EventType.PAGE_FEEDBACK],
                            },
                        },
                    );
                }

                return { type: 'complete' };
            }
            case 'regenerate.secret': {
                return {
                    state: {
                        ...element.state,
                        secret: generateSecret(),
                    },
                };
            }
        }
    },
    render: async (element, context) => {
        const { environment } = context;

        // Determine installation level and available events
        let installationLevel = '';
        let availableEvents: EventType[] = [];

        if (environment.spaceInstallation) {
            installationLevel = 'space';
            availableEvents = [EventType.CONTENT_UPDATED];
        } else if (environment.siteInstallation) {
            installationLevel = 'site';
            availableEvents = [EventType.SITE_VIEW, EventType.PAGE_FEEDBACK];
        }

        // Common webhook URL and secret configuration
        const webhookConfigSection = (
            <>
                <input
                    label="Webhook URL"
                    element={
                        <textinput
                            state="webhookUrl"
                            placeholder="https://your-domain.com/webhook"
                        />
                    }
                />

                <divider size="medium" />

                <markdown content="### Secret" />
                <text>
                    Use this secret to verify the GitBook webhook signatures (SHA-256 HMAC). See our{' '}
                    <link
                        target={{
                            url: `${context.environment.integration.externalLinks[0]?.url}#signature-verification-example`,
                        }}
                    >
                        documentation
                    </link>{' '}
                    for implementation examples.
                </text>

                <hstack align="center">
                    <box grow={1}>
                        <codeblock content={element.state.secret} />
                    </box>
                    <button
                        style="secondary"
                        label="Regenerate"
                        tooltip="Generate a new secret"
                        disabled={
                            element.state.secret !==
                            context.environment.installation?.configuration?.secret
                        }
                        onPress={{
                            action: 'regenerate.secret',
                        }}
                    />
                </hstack>

                <divider size="medium" />
            </>
        );

        // Event selection section (always present for space/site installations)
        const eventSelectionSection = (
            <>
                <text>Select which events you want to receive for this {installationLevel}:</text>

                {availableEvents.map((eventType) => (
                    <input
                        label={AVAILABLE_EVENTS[eventType]}
                        element={<switch state={eventType} />}
                    />
                ))}

                <divider size="medium" />
            </>
        );

        // Save button tooltip
        const saveButtonTooltip = `Save webhook configuration and event preferences for this ${installationLevel}`;

        return (
            <configuration>
                {webhookConfigSection}
                {eventSelectionSection}
                <input
                    label=""
                    hint=""
                    element={
                        <button
                            style="primary"
                            label="Save Configuration"
                            tooltip={saveButtonTooltip}
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
