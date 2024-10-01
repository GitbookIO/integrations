import { createComponent, getOAuthToken } from '@gitbook/runtime';
import { GitHubCopilotConfiguration, GitHubCopilotRuntimeContext } from './types';
import { ContentKitIcon } from '@gitbook/api';
import { fetchGitHubInstallations } from './github';
import { getGitHubOAuthConfiguration } from './oauth';

type ConfigureProps = {
    installation: {
        configuration?: GitHubCopilotConfiguration;
    };
};

/**
 * ContentKit component to configure the GitHub Copilot integration.
 */
export const configurationComponent = createComponent<
    ConfigureProps,
    {
        installations: string[];
    },
    {
        action: 'select.installation';
        installations: string[];
    },
    GitHubCopilotRuntimeContext
>({
    componentId: 'configure',
    initialState: (props, _, context) => {
        return {
            installations: context.environment.installation?.externalIds ?? [],
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'select.installation': {
                await context.api.integrations.updateIntegrationInstallation(
                    context.environment.integration.name,
                    context.environment.installation!.id,
                    {
                        externalIds: action.installations.slice(0, 5),
                    }
                );

                return {
                    ...element,
                    state: {
                        installations: action.installations,
                    },
                };
            }
        }

        return element;
    },
    render: async (element, context) => {
        const {
            props: { installation },
        } = element;
        const githubInstallations = installation.configuration?.oauth_credentials
            ? await fetchGitHubInstallations(
                  await getOAuthToken(
                      installation.configuration.oauth_credentials,
                      getGitHubOAuthConfiguration(context),
                      context
                  )
              )
            : [];

        return (
            <block>
                <vstack>
                    <input
                        label="Authenticate"
                        hint="Authenticate using your GitHub account"
                        element={
                            <button
                                label={
                                    installation.configuration?.oauth_credentials
                                        ? 'Connected'
                                        : 'Connect with GitHub'
                                }
                                icon={ContentKitIcon.Github}
                                onPress={{
                                    action: '@ui.url.open',
                                    url: `${context.environment.installation?.urls.publicEndpoint}/oauth`,
                                }}
                            />
                        }
                    />
                    {installation.configuration?.oauth_credentials ? (
                        <input
                            label="Select accounts"
                            hint={
                                <text>
                                    Choose the GitHub installation, user or organization.{' '}
                                    <link
                                        target={{
                                            url: context.environment.secrets.APP_INSTALL_URL,
                                        }}
                                    >
                                        Install the GitHub app.
                                    </link>
                                </text>
                            }
                            element={
                                <select
                                    state="installations"
                                    onValueChange={{
                                        action: 'select.installation',
                                        installations: element.dynamicState('installations'),
                                    }}
                                    multiple
                                    options={githubInstallations.map((githubInstallation) => ({
                                        id: githubInstallation.id.toString(),
                                        label: githubInstallation.account.login,
                                    }))}
                                />
                            }
                        />
                    ) : null}
                </vstack>
            </block>
        );
    },
});
