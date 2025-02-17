import { createComponent, ExposableError, InstallationConfigurationProps } from '@gitbook/runtime';

import type {
    OpenAPIRuntimeEnvironment,
    OpenAPIRuntimeContext,
} from '../types';

/**
 * ContentKit component to configure the content source.
 */
export const configureComponent = createComponent<
    InstallationConfigurationProps<OpenAPIRuntimeEnvironment>,
    {
        specURL: string;
        models: boolean;
    },
    { action: 'submit' },
    OpenAPIRuntimeContext
>({
    componentId: 'configureSource',
    initialState: (props, _, context) => {
        return {
            specURL: '',
            models: true,
        };
    },
    action: async (element, action, ctx) => {
        if (action.action === 'submit') {
            if (!element.state.specURL) {
                throw new ExposableError('Invalid spec URL');
            }

            return {
                type: 'complete',
                returnValue: {
                    props: {
                        specURL: element.state.specURL,
                        models: element.state.models,
                    },
                    dependencies: {
                        // Align with GenerateContentSourceDependencies
                        // spec: { kind: 'openapi', spec: element.dynamicState('spec') }
                    },
                }
            }
        }

        return element;
    },
    render: async (element, context) => {
        return (
            <configuration>
                <input
                    label="URL"
                    hint="Enter the URL of the OpenAPI specification."
                    element={<textinput state="specURL" />}
                />
                <input
                    label="Generate models"
                    hint="Generate a models page for all schema components."
                    element={<switch state="models" />}
                />
                <button
                    style="primary"
                    label="Continue"
                    onPress={{
                        action: 'submit',
                    }}
                />
            </configuration>
        );
    },
});