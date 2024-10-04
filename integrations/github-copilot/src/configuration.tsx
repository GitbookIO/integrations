import { ContentKitIcon } from '@gitbook/api';
import { InstallationConfigurationProps, createComponent, getOAuthToken } from '@gitbook/runtime';

import { fetchGitHubInstallations } from './github';
import { getGitHubOAuthConfiguration } from './oauth';
import type {
    GitHubCopilotConfiguration,
    GitHubCopilotRuntimeContext,
    GitHubCopilotRuntimeEnvironment,
} from './types';
import { createGitHubSetupState } from './setup';

/**
 * ContentKit component to configure the GitHub Copilot integration.
 */
export const configurationComponent = createComponent<
    InstallationConfigurationProps<GitHubCopilotRuntimeEnvironment>,
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
        element.setCache({ maxAge: 0 });
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

        const installURL = new URL(
            context.environment.secrets.APP_INSTALL_URL + '/installations/new'
        );
        installURL.searchParams.set(
            'state',
            await createGitHubSetupState(context, context.environment.installation!)
        );

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
                    {githubInstallations.length === 0 ? (
                        <input
                            label="Install on GitHub"
                            hint="Install the GitBook Copilot extension on GitHub"
                            element={
                                <button
                                    label={'Install on GitHub'}
                                    icon={ContentKitIcon.Github}
                                    onPress={{
                                        action: '@ui.url.open',
                                        url: installURL.toString(),
                                    }}
                                />
                            }
                        />
                    ) : (
                        <input
                            label="Select accounts"
                            hint={
                                <text>
                                    Choose the GitHub installation, user or organization.{' '}
                                    <link
                                        target={{
                                            url: installURL.toString(),
                                        }}
                                    >
                                        Install the GitHub app
                                    </link>
                                    . If your account is not listed, reauthenticate with GitHub to
                                    refresh the list.
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
                                        label:
                                            (githubInstallation.account &&
                                            'login' in githubInstallation.account
                                                ? githubInstallation.account.login
                                                : githubInstallation.account?.name) ?? 'Unknown',
                                    }))}
                                />
                            }
                        />
                    )}
                </vstack>
            </block>
        );
    },
});
