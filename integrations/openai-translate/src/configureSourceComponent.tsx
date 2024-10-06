import { createComponent } from '@gitbook/runtime';

import type { OpenAITranslateRuntimeContext } from './types';

/**
 * ContentKit component to configure the Translation source.
 */
export const configureSourceComponent = createComponent<
    {},
    {
        space?: string;
        language: string;
    },
    void,
    OpenAITranslateRuntimeContext
>({
    componentId: 'configureSource',
    initialState: (props, _, context) => {
        return {
            language: 'en',
        }
    },
    render: async (element, context) => {
        const { api, environment } = context;
        const { integration, installation } = environment;

        if (!installation) {
            throw new Error('Installation not found');
        }

        const { data: { items: spaces } } = await api.integrations.listIntegrationInstallationSpaces(integration.name, installation.id);
        return (
            <block>
                <input
                    label="Source space"
                    hint="Select the space to translate content from."
                    element={
                        <select
                            state="space"
                            options={spaces.map(space => ({
                                id: space.space,
                                label: space.space,
                            }))}
                        />
                    }
                />
                <input
                    label="Language"
                    hint="Select the language to translate content to."
                    element={
                        <select
                            state="language"
                            options={[
                                { label: 'English', id: 'en' },
                                { label: 'French', id: 'fr' },
                                { label: 'German', id: 'de' },
                                { label: 'Italian', id: 'it' },
                                { label: 'Japanese', id: 'ja' },
                                { label: 'Korean', id: 'ko' },
                                { label: 'Portuguese', id: 'pt' },
                                { label: 'Russian', id: 'ru' },
                                { label: 'Spanish', id: 'es' },
                            ]}
                        />
                    }
                />
                <button style="primary" label="Continue" onPress={{
                    action: '@ui.submit',
                    returnValue: {
                        props: {
                            space: element.dynamicState('space'),
                            language: element.dynamicState('language'),
                        },
                        dependsOn: [
                            {
                                kind: 'space',
                                space: element.dynamicState('space'),
                            }
                        ]
                    }
                }} />
            </block>
        );
    },
});
