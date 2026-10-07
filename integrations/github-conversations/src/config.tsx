import { createComponent, InstallationConfigurationProps } from '@gitbook/runtime';
import { GitHubRuntimeContext, GitHubRuntimeEnvironment } from './types';

export const configComponent = createComponent<
    InstallationConfigurationProps<GitHubRuntimeEnvironment>,
    { step: 'edit.repo' | 'authenticate' | 'initial'; repo?: string },
    { action: 'save.repo' | 'edit.repo' },
    GitHubRuntimeContext
>({
    componentId: 'config',
    initialState: (props) => {
        const { installation } = props;
        if (installation.configuration?.repository && installation.configuration?.oauth_credentials) {
            return { step: 'initial' as const };
        }
        if (installation.configuration?.repository) {
            return { step: 'authenticate' as const };
        }
        return { step: 'edit.repo' as const, repo: '' };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'edit.repo':
                return {
                    state: {
                        step: 'edit.repo',
                        repo: context.environment.installation?.configuration?.repository ?? '',
                    },
                };
            case 'save.repo':
                await context.api.integrations.updateIntegrationInstallation(
                    context.environment.integration.name,
                    context.environment.installation!.id,
                    {
                        configuration: {
                            repository: action.repo,
                        },
                    },
                );
                return { state: { step: 'authenticate' } };
        }
    },
    render: async (element, context) => {
        const { installation } = context.environment;
        if (!installation) {
            return null;
        }
        switch (element.state.step) {
            case 'initial':
                return (
                    <configuration>
                        <input
                            label="Repository"
                            hint={<text>The integration is configured with the following repository:</text>}
                            element={<textinput state="repo" initialValue={installation.configuration!.repository!} disabled={true} />}
                        />
                        <box>
                            <button style="secondary" label="Edit configuration" onPress={{ action: 'edit.repo' }} />
                        </box>
                        <divider />
                        <input
                            label="Authenticate"
                            hint="Authorize GitBook to access your GitHub discussions."
                            element={<button style="secondary" label="Authorize" onPress={{ action: '@ui.url.open', url: `${installation.urls.publicEndpoint}/oauth` }} />}
                        />
                    </configuration>
                );
            case 'edit.repo':
                return (
                    <configuration>
                        <input
                            label="Repository"
                            hint={<text>Repository in the form owner/repo.</text>}
                            element={<textinput state="repo" placeholder="owner/repo" />}
                        />
                        <box>
                            <button style="primary" label="Save" onPress={{ action: 'save.repo', repo: element.dynamicState('repo') }} />
                        </box>
                    </configuration>
                );
            case 'authenticate':
                return (
                    <configuration>
                        <input
                            label="Repository"
                            element={<textinput state="repo" initialValue={installation.configuration!.repository!} disabled={true} />}
                        />
                        <divider />
                        <input
                            label="Authenticate"
                            hint="Authorize GitBook to access your GitHub discussions."
                            element={<button style="secondary" label="Authorize" onPress={{ action: '@ui.url.open', url: `${installation.urls.publicEndpoint}/oauth` }} />}
                        />
                    </configuration>
                );
            default:
                return null;
        }
    },
});
