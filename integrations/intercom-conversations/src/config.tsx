import { createComponent, InstallationConfigurationProps } from '@gitbook/runtime';
import { IntercomRuntimeContext, IntercomRuntimeEnvironment } from './types';

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

        return (
            <configuration>
                <input
                    label="Authenticate"
                    hint="Authorize GitBook to access your Intercom account."
                    element={
                        <button
                            style="secondary"
                            disabled={false}
                            label={
                                element.props.installation.configuration.oauth_credentials
                                    ? 'Re-authorize'
                                    : 'Authorize'
                            }
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
