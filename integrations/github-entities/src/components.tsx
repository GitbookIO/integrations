import hash from 'hash-sum';
import createHttpError from 'http-errors';

import { ContentKitIcon, IntegrationInstallation } from '@gitbook/api';
import { createComponent, Logger } from '@gitbook/runtime';

import { createAppInstallationAccessToken, extractTokenCredentialsOrThrow } from './api';
import { queueSyncRepositories } from './syncing';
import {
    ConfigureAction,
    ConfigureProps,
    ConfigureState,
    GitHubAccountConfiguration,
    GithubRuntimeContext,
} from './types';
import { assertIsDefined, authenticateAsIntegration } from './utils';

const logger = Logger('github-entities:components');

/**
 * ContentKit component to configure the GitHub Lens integration.
 */
export const syncBlock = createComponent<
    ConfigureProps,
    ConfigureState,
    ConfigureAction,
    GithubRuntimeContext
>({
    componentId: 'sync',
    initialState: (props) => {
        return {
            installation: props.installation.configuration?.installation,
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'select.installation':
                return {
                    ...element,
                    state: {
                        ...element.state,
                        installation: action.installation,
                    },
                };
            case 'app.installed':
                if (context.environment.installation) {
                    await markAppAsInstalled(context, context.environment.installation);
                }
                return element;
            case 'start.sync':
                await saveSyncConfiguration(context, element.state);
                return element;
        }
    },
    render: async (element, context) => {
        const installation = context.environment.installation;
        assertIsDefined(installation, {
            label: 'installation',
        });
        const installationPublicEndpoint = installation.urls.publicEndpoint;

        let accessToken: string | undefined;
        try {
            const tokenCredentials = extractTokenCredentialsOrThrow(context);
            accessToken = tokenCredentials.access_token;
        } catch (error) {
            // Ignore: We will show the button to connect
        }
        const buttonLabel = accessToken ? 'Connected' : 'Connect with GitHub';

        /**
         * The version hash will be used to invalidate the cache of the select components
         * on the frontend when the input props to the component change.
         */
        const versionHash = hash(element.props);

        const showAppInstall = Boolean(
            !installation.configuration?.key && !installation.configuration?.hasInstalledApp
        );

        const appInstallUrl = context.environment.secrets.APP_INSTALL_URL;

        return (
            <block>
                {showAppInstall ? (
                    <>
                        <input
                            label="App Installation"
                            hint="Install the GitBook Entities app on your GitHub account"
                            element={
                                <button
                                    label="Install"
                                    icon={ContentKitIcon.Github}
                                    onPress={{
                                        action: '@ui.url.open',
                                        url: `${appInstallUrl}?state=${installation.id}`,
                                    }}
                                />
                            }
                        />
                        <hstack align="end">
                            <button
                                style="primary"
                                label="Already installed? Continue"
                                onPress={{ action: 'app.installed' }}
                            />
                        </hstack>
                    </>
                ) : (
                    <>
                        <input
                            label="Authenticate"
                            hint="Authenticate using your GitHub account"
                            element={
                                <button
                                    label={buttonLabel}
                                    icon={ContentKitIcon.Github}
                                    tooltip={buttonLabel}
                                    onPress={{
                                        action: '@ui.url.open',
                                        url: `${installationPublicEndpoint}/oauth`,
                                    }}
                                />
                            }
                        />

                        {accessToken ? (
                            <>
                                <divider size="medium" />

                                <vstack>
                                    <input
                                        label="Select account"
                                        hint={
                                            <text>
                                                Choose the GitHub installation, user or
                                                organization. Make sure you have installed the
                                                <link
                                                    target={{
                                                        url: appInstallUrl,
                                                    }}
                                                >
                                                    {' '}
                                                    GitBook Entities app
                                                </link>
                                            </text>
                                        }
                                        element={
                                            <select
                                                state="installation"
                                                onValueChange={{
                                                    action: 'select.installation',
                                                    installation:
                                                        element.dynamicState('installation'),
                                                }}
                                                options={{
                                                    url: {
                                                        host: new URL(installationPublicEndpoint)
                                                            .host,
                                                        pathname: `${
                                                            new URL(installationPublicEndpoint)
                                                                .pathname
                                                        }/installations`,
                                                        query: {
                                                            v: versionHash,
                                                        },
                                                    },
                                                }}
                                            />
                                        }
                                    />
                                </vstack>

                                {element.state.installation && !installation.configuration.key ? (
                                    <hstack align="end">
                                        <button
                                            style="primary"
                                            disabled={!element.state.installation}
                                            label="Start syncing"
                                            tooltip="Sync GitHub entities to this organization"
                                            onPress={{ action: 'start.sync' }}
                                        />
                                    </hstack>
                                ) : null}

                                {installation.configuration.key ? (
                                    <box>
                                        <hint>
                                            <text>
                                                🔁 The integration is now syncing entities from
                                                GitHub to this organization{' '}
                                            </text>
                                        </hint>
                                    </box>
                                ) : null}
                            </>
                        ) : null}
                    </>
                )}
            </block>
        );
    },
});

async function markAppAsInstalled(
    context: GithubRuntimeContext,
    existingInstallation: IntegrationInstallation
) {
    await context.api.integrations.updateIntegrationInstallation(
        context.environment.integration.name,
        existingInstallation.id,
        {
            configuration: {
                ...existingInstallation.configuration,
                hasInstalledApp: true,
            },
        }
    );
}

async function saveSyncConfiguration(
    context: GithubRuntimeContext,
    state: GitHubAccountConfiguration
) {
    const { api, environment } = context;
    const installation = environment.installation;

    assertIsDefined(installation, { label: 'installation' });

    if (!state.installation) {
        throw createHttpError(400, 'Incomplete configuration');
    }

    const { access_token: userInstallationAccessToken } = extractTokenCredentialsOrThrow(context);

    const githubInstallationId = state.installation;

    const integrationConfigurationId = crypto.randomUUID();
    const configurationBody: GitHubAccountConfiguration = {
        ...installation.configuration,
        key: integrationConfigurationId,
        installation: state.installation,
    };

    // Save the installation configuration
    await api.integrations.updateIntegrationInstallation(
        environment.integration.name,
        installation.id,
        {
            externalIds: [githubInstallationId],
            configuration: configurationBody,
        }
    );

    logger.info(`Saved config ${integrationConfigurationId} for installation ${installation.id}`);

    const githubInstallationAccessToken = await createAppInstallationAccessToken(
        context,
        githubInstallationId
    );
    const integrationContext = await authenticateAsIntegration(context);
    await queueSyncRepositories(integrationContext, {
        integrationInstallationId: installation.id,
        organizationId: installation.target.organization,
        integrationConfigurationId,
        githubInstallationId,
        userInstallationAccessToken,
        token: githubInstallationAccessToken,
        retriesLeft: 3,
        page: 1,
    });
    logger.info(
        `Queued sync of repos for installation ${installation.id} (github: ${githubInstallationId})`
    );
}
