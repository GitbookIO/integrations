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

export const accountConfigComponent = createComponent<
    {
        installation: {
            configuration?: WebhookAccountConfiguration;
        };
    },
    WebhookAccountConfiguration,
    {
        action: 'save.config' | 'regenerate.secret';
    },
    WebhookRuntimeContext
>({
    componentId: 'account-config',
    initialState: (props) => {
        const config = props.installation?.configuration;
        return {
            webhookUrl: config?.webhookUrl || '',
            secret: config?.secret || generateSecret(),
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

                const configuration = {
                    webhookUrl: webhookUrl,
                    secret: element.state.secret,
                };

                await api.integrations.updateIntegrationInstallation(
                    environment.integration.name,
                    environment.installation!.id,
                    { configuration },
                );

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
        return (
            <configuration>
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
                            element.props.installation?.configuration?.secret
                        }
                        onPress={{
                            action: 'regenerate.secret',
                        }}
                    />
                </hstack>

                <divider size="medium" />

                <input
                    label=""
                    hint=""
                    element={
                        <button
                            style="primary"
                            label="Save organization changes"
                            tooltip="Save webhook URL and secret"
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

export const configComponent = createComponent<
    {
        installation: {
            configuration?: WebhookAccountConfiguration;
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

        // Determine which events are available based on installation level
        let availableEvents: EventType[] = [];
        if (props.spaceInstallation) {
            availableEvents = [EventType.CONTENT_UPDATED];
        } else if (props.siteInstallation) {
            availableEvents = [EventType.SITE_VIEW, EventType.PAGE_FEEDBACK];
        } else if (props.installation) {
            // Organization level - no events available
            availableEvents = [];
        }

        // For space/site installations, we only store event preferences
        // The webhookUrl and secret come from the account-level configuration
        return Object.fromEntries(
            availableEvents.map((eventType) => [eventType, config?.[eventType] ?? false]),
        ) as WebhookConfiguration;
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'save.config': {
                const { api, environment } = context;

                // Determine which events are available based on installation level
                let availableEvents: EventType[] = [];
                if (environment.spaceInstallation) {
                    availableEvents = [EventType.CONTENT_UPDATED];
                } else if (environment.siteInstallation) {
                    availableEvents = [EventType.SITE_VIEW, EventType.PAGE_FEEDBACK];
                } else if (environment.installation) {
                    throw new ExposableError(
                        'Configuration is not allowed at the organization level',
                    );
                }

                // Validate that at least one available event is enabled
                const hasEnabledEvents = availableEvents.some(
                    (eventType) => element.state[eventType],
                );
                if (!hasEnabledEvents) {
                    throw new ExposableError('At least one event type must be enabled');
                }

                // Only save event preferences - webhookUrl and secret come from account-level config
                const configuration = Object.fromEntries(
                    availableEvents.map((eventType) => [eventType, element.state[eventType]]),
                ) as WebhookConfiguration;

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
    render: async (element, context) => {
        const { environment } = context;

        // Determine which events are available based on installation level
        let availableEvents: EventType[] = [];
        let installationLevel = '';

        if (environment.spaceInstallation) {
            // Space level: only content updates
            availableEvents = [EventType.CONTENT_UPDATED];
            installationLevel = 'space';
        } else if (environment.siteInstallation) {
            // Site level: site views and page feedback
            availableEvents = [EventType.SITE_VIEW, EventType.PAGE_FEEDBACK];
            installationLevel = 'site';
        } else {
            return (
                <configuration>
                    <text>No installation found.</text>
                </configuration>
            );
        }

        return (
            <configuration>
                <text>Select which events you want to receive for this {installationLevel}:</text>

                {availableEvents.map((eventType) => (
                    <input
                        label={AVAILABLE_EVENTS[eventType]}
                        element={<switch state={eventType} />}
                    />
                ))}

                <divider size="medium" />

                <input
                    label=""
                    hint=""
                    element={
                        <button
                            style="primary"
                            label={`Save ${installationLevel === 'space' ? 'space' : 'site'} changes`}
                            tooltip={`Save event preferences for this ${installationLevel}`}
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
