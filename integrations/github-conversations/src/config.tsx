import { createComponent, InstallationConfigurationProps } from '@gitbook/runtime';
import { GitHubRuntimeContext, GitHubRuntimeEnvironment } from './types';

/**
 * Configuration component for the GitHub Conversations integration.
 */
export const configComponent = createComponent<
    InstallationConfigurationProps<GitHubRuntimeEnvironment>,
    {},
    undefined,
    GitHubRuntimeContext
>({
    componentId: 'config',
    render: async (element, context) => {
        const { installation } = context.environment;

        if (!installation) {
            return null;
        }

        console.log('Rendering GitHub configuration component', {
            installationId: installation.id,
            configuration: installation.configuration,
        });

        return (
            <configuration>
                <input
                    label="Authenticate"
                    hint="Authorize GitBook to access your GitHub account."
                    element={
                        <button
                            style="secondary"
                            disabled={false}
                            label={
                                element.props.installation.configuration.installation_id
                                    ? 'Re-authorize'
                                    : 'Authorize'
                            }
                            onPress={{
                                action: '@ui.url.open',
                                url: `${installation?.urls.publicEndpoint}/install`,
                            }}
                        />
                    }
                />

                {element.props.installation.configuration.oauth_credentials ? (
                    <hint>
                        <text>
                            The integration is configured and discussions are being ingested.
                        </text>
                    </hint>
                ) : null}
            </configuration>
        );
    },
});
