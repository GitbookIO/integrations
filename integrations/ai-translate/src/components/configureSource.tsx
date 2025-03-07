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
        specialTerms: string;
        instruction: string;
    },
    { action: 'submit' } | { action: 'selectSpace'; space: string },
    AiTranslateRuntimeContext
>({
    componentId: 'configureSource',
    initialState: (props, _, context) => {
        return {
            space: null,
            language: 'fr',
            instruction: '',
            specialTerms: '',
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
                        language: element.state.language,
                        instruction: element.state.instruction,
                        specialTerms: element.state.specialTerms,
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
            },
        );

        return (
            <configuration>
                <input
                    label="Original Space"
                    hint="Choose a space to translate the content from. The content will be translated to the language you choose below and automatically updated as the original content changes."
                    element={
                        <select
                            state="space"
                            options={spaces.map((space) => ({
                                label:
                                    typeof space.space === 'string'
                                        ? space.space
                                        : space.space.title,
                                id: typeof space.space === 'string' ? space.space : space.space.id,
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
                    element={<select state="language" options={languages} />}
                />

                <divider />

                <input
                    label="Special terms"
                    hint="Provide special terms that should not be translated. Each term should be separated by a comma."
                    element={<textinput multiline state="specialTerms" />}
                />

                <input
                    label="Advanced Instruction"
                    hint="Provide special instructions for the translation."
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
