import { createComponent, InstallationConfigurationProps } from '@gitbook/runtime';
import type { IntercomRuntimeContext, IntercomRuntimeEnvironment } from './types';

/**
 * Configuration component for the Intercom integration.
 */
export const configComponent = createComponent<
    InstallationConfigurationProps<IntercomRuntimeEnvironment>,
    {},
    undefined,
    IntercomRuntimeContext
>({
    componentId: 'config',
    render: async (element, context) => {
        const { installation } = context.environment;
        if (!installation) {
            return null;
        }

        const isConfigured = !!element.props.installation.configuration.oauth_credentials;

        return (
            <configuration>
                {isConfigured ? (
                    <box>
                        <hint>
                            <text style="bold">
                                The connector is configured and conversations are being ingested.
                                You can now close this dialog.
                            </text>
                        </hint>
                        <divider size="medium" />
                    </box>
                ) : null}
                <input
                    label="Authenticate"
                    hint="Authorize GitBook to access your Intercom account."
                    element={
                        <button
                            style="secondary"
                            disabled={false}
                            label={isConfigured ? 'Re-authorize' : 'Authorize'}
                            onPress={{
                                action: '@ui.url.open',
                                url: `${installation?.urls.publicEndpoint}/oauth`,
                            }}
                        />
                    }
                />
            </configuration>
        );
    },
});
