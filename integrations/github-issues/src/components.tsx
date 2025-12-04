import { createComponent, InstallationConfigurationProps } from '@gitbook/runtime';
import type { GitHubIssuesRuntimeContext, GitHubIssuesRuntimeEnvironment } from './types';
import { createGitHubAppSetupState } from './setup';

/**
 * Configuration component for the GitHub Conversations integration.
 */
export const configComponent = createComponent<
    InstallationConfigurationProps<GitHubIssuesRuntimeEnvironment>,
    {},
    undefined,
    GitHubIssuesRuntimeContext
>({
    componentId: 'config',
    render: async (element, context) => {
        const { installation } = context.environment;

        if (!installation) {
            return null;
        }

        const config = element.props.installation.configuration;
        const hasInstallations = config.installation_ids && config.installation_ids.length > 0;

        const githubAppInstallURL = new URL(
            `https://github.com/apps/${context.environment.secrets.GITHUB_APP_NAME}/installations/new`,
        );
        const githubAppSetupState = await createGitHubAppSetupState(context, {
            gitBookInstallationId: installation.id,
        });
        githubAppInstallURL.searchParams.append('state', githubAppSetupState);

        return (
            <configuration>
                <input
                    label="GitHub App Installation"
                    hint="Authorize GitBook to access your GitHub issues in your repositories."
                    element={
                        <button
                            style="secondary"
                            disabled={false}
                            label={hasInstallations ? 'Manage repositories' : 'Install GitHub App'}
                            onPress={{
                                action: '@ui.url.open',
                                url: githubAppInstallURL.toString(),
                            }}
                        />
                    }
                />
            </configuration>
        );
    },
});
