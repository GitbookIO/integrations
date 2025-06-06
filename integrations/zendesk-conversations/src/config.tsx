import { createComponent, InstallationConfigurationProps } from '@gitbook/runtime';
import { ZendeskRuntimeContext, ZendeskRuntimeEnvironment } from './types';

type State =
    | {
          step: 'initial';
          subdomain?: undefined;
      }
    | {
          step: 'edit.subdomain';
          subdomain: string;
      }
    | {
          step: 'authenticate';
          subdomain?: undefined;
      };

type Action =
    | {
          action: 'edit.subdomain';
      }
    | {
          action: 'save.subdomain';
          subdomain: string;
      };

/**
 * Configuration component for the Zendesk integration.
 */
export const configComponent = createComponent<
    InstallationConfigurationProps<ZendeskRuntimeEnvironment>,
    State,
    Action,
    ZendeskRuntimeContext
>({
    componentId: 'config',
    initialState: (props) => {
        const { installation } = props;

        if (installation.configuration?.subdomain && installation.configuration.oauth_credentials) {
            return {
                step: 'initial' as const,
            };
        }

        if (installation.configuration?.subdomain) {
            return {
                step: 'authenticate' as const,
            };
        }

        return {
            step: 'edit.subdomain' as const,
            subdomain: '',
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'edit.subdomain': {
                return {
                    state: {
                        step: 'edit.subdomain',
                        subdomain: element.props.installation.configuration?.subdomain ?? '',
                    },
                };
            }
            case 'save.subdomain': {
                const { api, environment } = context;

                await api.integrations.updateIntegrationInstallation(
                    environment.integration.name,
                    environment.installation!.id,
                    {
                        configuration: {
                            subdomain: normalizeSubdomain(action.subdomain),
                        },
                    },
                );

                return {
                    state: {
                        step: 'authenticate',
                    },
                };
            }
        }
    },
    render: async (element, context) => {
        const { installation } = context.environment;
        if (!installation) {
            return null;
        }

        switch (element.state.step) {
            case 'initial': {
                return (
                    <configuration>
                        <input
                            label="Subdomain"
                            hint={
                                <text>
                                    The integration is configured with the following Zendesk domain:
                                </text>
                            }
                            element={
                                <textinput
                                    state="subdomain"
                                    initialValue={`https://${installation.configuration.subdomain}.zendesk.com`}
                                    disabled={true}
                                />
                            }
                        />
                        <box>
                            <button
                                style="secondary"
                                disabled={false}
                                label="Edit configuration"
                                onPress={{
                                    action: 'edit.subdomain',
                                }}
                            />
                        </box>
                    </configuration>
                );
            }
            case 'edit.subdomain': {
                return (
                    <configuration>
                        <input
                            label="Subdomain"
                            hint={
                                <text>
                                    The subdomain of your Zendesk account. For example, if your
                                    Zendesk domain is{' '}
                                    <text style="code">https://my-subdomain.zendesk.com</text>, the
                                    subdomain is <text style="code">my-subdomain</text>.
                                </text>
                            }
                            element={<textinput state="subdomain" placeholder="Subdomain" />}
                        />
                        <box>
                            <button
                                style="primary"
                                label="Save subdomain"
                                onPress={{
                                    action: 'save.subdomain',
                                    subdomain: element.dynamicState('subdomain'),
                                }}
                            />
                        </box>
                    </configuration>
                );
            }
            case 'authenticate': {
                return (
                    <configuration>
                        <input
                            label="Subdomain"
                            hint={
                                <text>
                                    The integration is configured with the following Zendesk domain:
                                </text>
                            }
                            element={
                                <textinput
                                    state="subdomain"
                                    initialValue={`https://${installation.configuration.subdomain}.zendesk.com`}
                                    disabled={true}
                                />
                            }
                        />
                        <divider />
                        <input
                            label="Authenticate"
                            hint="Authorize GitBook to access your Zendesk account."
                            element={
                                <button
                                    style="secondary"
                                    disabled={false}
                                    label="Authorize"
                                    onPress={{
                                        action: '@ui.url.open',
                                        url: `${installation?.urls.publicEndpoint}/oauth`,
                                    }}
                                />
                            }
                        />
                    </configuration>
                );
            }
            default: {
                throw new Error(`Unknown step: ${JSON.stringify(element.state)}`);
            }
        }
    },
});

/**
 * Normalize the input of the user to extract only the subdomain, in case the user is inserting the whole url or domain.
 */
function normalizeSubdomain(subdomain: string) {
    try {
        const url = new URL(subdomain);
        return url.hostname.split('.')[0];
    } catch (error) {
        const parts = subdomain.split('.');
        return parts[0];
    }
}
