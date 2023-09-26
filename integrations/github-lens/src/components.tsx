import hash from 'hash-sum';
import createHttpError from 'http-errors';

import { ContentKitIcon } from '@gitbook/api';
import { createComponent, Logger } from '@gitbook/runtime';

import { extractTokenCredentialsOrThrow, fetchRepository } from './api';
import { syncRepositoriesToOrganization } from './syncing';
import {
    ConfigureAction,
    ConfigureProps,
    ConfigureState,
    GitHubAccountConfiguration,
    GithubRuntimeContext,
} from './types';
import { assertIsDefined } from './utils';

const logger = Logger('github-lens:components');

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
            repositories: props.installation.configuration?.repositories,
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
            case 'select.repositories':
                return {
                    ...element,
                    state: {
                        ...element.state,
                        repositories: action.repositories,
                    },
                };
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

        const currentRepositoriesMetadata =
            element.props.installation.configuration?.repositoriesWithMetadata || [];
        const currentRepositoriesNames = currentRepositoriesMetadata
            .map((r) => `${r.repoFullName}`)
            .join(', ');

        const showSyncButton =
            element.state.repositories &&
            element.state.repositories.length > 0 &&
            element.state.repositories.some(
                (repo) =>
                    (element.props.installation.configuration?.repositories || []).includes(
                        repo
                    ) === false
            );

        return (
            <block>
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
                                        Choose the GitHub installation, user or organization.
                                        <link
                                            target={{
                                                url: 'https://github.com/apps/gitbook-x-dev-taran/installations/new',
                                            }}
                                        >
                                            {' '}
                                            Install the GitHub app.
                                        </link>
                                    </text>
                                }
                                element={
                                    <select
                                        state="installation"
                                        onValueChange={{
                                            action: 'select.installation',
                                            installation: element.dynamicState('installation'),
                                        }}
                                        options={{
                                            url: {
                                                host: new URL(installationPublicEndpoint).host,
                                                pathname: `${
                                                    new URL(installationPublicEndpoint).pathname
                                                }/installations`,
                                                query: {
                                                    v: versionHash,
                                                },
                                            },
                                        }}
                                    />
                                }
                            />

                            {element.state.installation ? (
                                <>
                                    <input
                                        label="Select repositories"
                                        hint={
                                            <text>
                                                Choose the GitHub repositories to sync to this
                                                organization.
                                            </text>
                                        }
                                        element={
                                            <select
                                                state="repositories"
                                                multiple
                                                onValueChange={{
                                                    action: 'select.repositories',
                                                    repositories:
                                                        element.dynamicState('repositories'),
                                                }}
                                                options={{
                                                    url: {
                                                        host: new URL(installationPublicEndpoint)
                                                            .host,
                                                        pathname: `${
                                                            new URL(installationPublicEndpoint)
                                                                .pathname
                                                        }/repos`,
                                                        query: {
                                                            installation:
                                                                element.dynamicState(
                                                                    'installation'
                                                                ),
                                                            v: versionHash,
                                                        },
                                                    },
                                                }}
                                            />
                                        }
                                    />
                                </>
                            ) : null}
                        </vstack>

                        {currentRepositoriesMetadata.length > 0 ? (
                            <box>
                                <hint>
                                    <text>
                                        ⚙️ The integration is currently syncing entities from{' '}
                                        <text style="bold">{currentRepositoriesNames}.</text>
                                    </text>
                                </hint>
                            </box>
                        ) : null}

                        {showSyncButton ? (
                            <input
                                label=""
                                hint=""
                                element={
                                    <button
                                        style="primary"
                                        disabled={
                                            !element.state.installation ||
                                            !element.state.repositories
                                        }
                                        label="Sync repositories"
                                        tooltip="Sync the entities of the selected repositories to this organization"
                                        onPress={{ action: 'start.sync' }}
                                    />
                                }
                            />
                        ) : null}
                    </>
                ) : null}
            </block>
        );
    },
});

async function saveSyncConfiguration(
    context: GithubRuntimeContext,
    state: GitHubAccountConfiguration
) {
    const { api, environment } = context;
    const installation = environment.installation;

    assertIsDefined(installation, { label: 'installation' });

    if (!state.installation || !state.repositories || !('organization' in installation.target)) {
        throw createHttpError(400, 'Incomplete configuration');
    }

    const externalIds: string[] = [];
    state.repositories?.forEach((repo) => {
        externalIds.push(repo);
    });

    const repositoriesWithMetadata: NonNullable<
        ConfigureProps['installation']['configuration']
    >['repositoriesWithMetadata'] = [];
    for (const repositoryId of state.repositories) {
        const repo = await fetchRepository(context, parseInt(repositoryId, 10));
        repositoriesWithMetadata.push({
            repoId: repositoryId,
            repoName: repo.name,
            repoFullName: repo.full_name,
            repoOwner: repo.owner.login,
        });
    }

    const integrationConfigurationId = crypto.randomUUID();

    const configurationBody: GitHubAccountConfiguration = {
        ...installation.configuration,
        key: integrationConfigurationId,
        installation: state.installation,
        repositories: state.repositories,
        repositoriesWithMetadata,
    };

    // Save the installation configuration
    await api.integrations.updateIntegrationInstallation(
        environment.integration.name,
        installation.id,

        {
            externalIds,
            configuration: configurationBody,
        }
    );

    logger.info(`Saved config ${integrationConfigurationId} for installation ${installation.id}`);

    await syncRepositoriesToOrganization(
        context,
        installation.target.organization,
        installation.id,
        integrationConfigurationId,
        state.installation,
        repositoriesWithMetadata
    );
}
