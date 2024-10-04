import { createComponent, InstallationConfigurationProps } from '@gitbook/runtime';

import { DEFAULT_MODEL, type OpenAITranslateRuntimeContext, type OpenAITranslateRuntimeEnvironment } from './types';

/**
 * ContentKit component to configure the integration.
 */
export const configureComponent = createComponent<
    InstallationConfigurationProps<OpenAITranslateRuntimeEnvironment>,
    {
        apiKey: string;
        model: string;
        apiUrl: string;
    },
    { action: 'save' },
    OpenAITranslateRuntimeContext
>({
    componentId: 'configure',
    initialState: (props, _, context) => {
        return {
            apiKey: props.installation.configuration.apiKey ?? '',
            model: props.installation.configuration.model ?? DEFAULT_MODEL,
            apiUrl: props.installation.configuration.apiUrl ?? '',
        }
    },
    action: async (element, action, ctx) => {
        const { integration, installation } = ctx.environment;
        if (action.action === 'save' && installation) {
            await ctx.api.integrations.updateIntegrationInstallation(
                integration.name,
                installation.id,
                {
                    configuration: {
                        apiKey: element.state.apiKey,
                        model: element.state.model,
                        apiUrl: element.state.apiUrl,
                    },
                }
            )
        }

        return element;
    },
    render: async (element, context) => {
        return (
            <block>
                <input
                    label="API Key"
                    hint="OpenAI API key"
                    element={
                        <textinput state="apiKey" />
                    }
                />
                <input
                    label="API URL"
                    hint="When using a custom provider or proxy, enter the URL of the OpenAI API."
                    element={
                        <textinput state="apiUrl" />
                    }
                />
                <input
                    label="Model"
                    hint="Select the model to use for translation. We recommend picking powerful models like GPT-4 or GPT-4o."
                    element={
                        <select
                            state="model"
                            options={[
                                {
                                    id: 'gpt-4',
                                    label: 'GPT-4',
                                }, 
                                {
                                    id: 'gpt-4o',
                                    label: 'GPT-4o',
                                },
                            ]}
                            />
                    }
                />
                <button style="primary" label="Save" onPress={{
                    action: 'save'
                }} />
            </block>
        );
    },
});
