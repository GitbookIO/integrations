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

        const config = element.props.installation.configuration;
        const hasInstallations = config.installation_ids && config.installation_ids.length > 0;
        const isConnected = hasInstallations;

        return (
            <configuration>
                <input
                    label="Authenticate"
                    hint="Authorize GitBook to access your GitHub account and repositories."
                    element={
                        <button
                            style="secondary"
                            disabled={false}
                            label={isConnected ? 'Add more repositories' : 'Authorize'}
                            onPress={{
                                action: '@ui.url.open',
                                url: `${installation?.urls.publicEndpoint}/install`,
                            }}
                        />
                    }
                />
            </configuration>
        );
    },
});
