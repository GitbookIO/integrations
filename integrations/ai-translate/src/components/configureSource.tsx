import { createComponent, ExposableError, InstallationConfigurationProps } from '@gitbook/runtime';

import type { AiTranslateRuntimeEnvironment, AiTranslateRuntimeContext } from '../types';
import { languages } from '../languages';

/**
 * ContentKit component to configure the content source.
 */
export const configureComponent = createComponent<
    InstallationConfigurationProps<AiTranslateRuntimeEnvironment>,
    {
        space: string | null;
        language: string;
        instruction: string;
    },
    { action: 'submit' } | { action: 'selectSpace'; space: string },
    AiTranslateRuntimeContext
>({
    componentId: 'configureSource',
    initialState: (props, _, context) => {
        return {
            space: null,
            language: 'en',
            instruction: '',
        };
    },
    action: async (element, action, ctx) => {
        if (action.action === 'submit') {
            if (!element.state.space) {
                throw new ExposableError('Invalid space');
            }

            return {
                type: 'complete',
                returnValue: {
                    props: {
                        instruction: element.state.instruction,
                    },
                    dependencies: {
                        space: {
                            ref: {
                                kind: 'space',
                                space: element.state.space,
                            },
                        },
                    },
                },
            };
        }

        if (action.action === 'selectSpace') {
            return {
                ...element,
                state: {
                    ...element.state,
                    space: action.space,
                },
            };
        }

        return element;
    },
    render: async (element, context) => {
        const { api } = context;
        const { integration, installation } = context.environment;
        const { state } = element;

        if (!installation) {
            throw new ExposableError('Installation not found');
        }

        const {
            data: { items: spaces },
        } = await api.integrations.listIntegrationInstallationSpaces(
            integration.name,
            installation.id,
            {
                extended: true,
            }
        );

        return (
            <configuration>
                <input
                    label="Original Space"
                    hint="Choose the space to translate the documentation from."
                    element={
                        <select
                            state="space"
                            options={spaces.map((space) => ({
                                label: typeof space.space === 'string' ? space.space : space.space.title,
                                id: space.space,
                            }))}
                            onValueChange={{
                                action: 'selectSpace',
                                space: element.dynamicState('space'),
                            }}
                        />
                    }
                />
                <input
                    label="Language"
                    hint="Choose the language to translate the documentation to."
                    element={
                        <select
                            state="language"
                            options={languages}
                        />
                    }
                />

                <divider />

                <input
                    label="Instruction"
                    hint="Provide instructions for the translation."
                    element={<textinput multiline state="instruction" />}
                />
                <button
                    style="primary"
                    label="Continue"
                    disabled={!state.space}
                    onPress={{
                        action: 'submit',
                    }}
                />
            </configuration>
        );
    },
});
