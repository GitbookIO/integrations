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
    },
    { action: 'submit' },
    OpenAPIRuntimeContext
>({
    componentId: 'configureSource',
    initialState: (props, _, context) => {
        return {
            specURL: '',
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
                    label="Spec URL"
                    hint="Enter the URL of the OpenAPI specification."
                    element={<textinput state="specURL" />}
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