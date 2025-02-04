import { createComponent, InstallationConfigurationProps } from '@gitbook/runtime';

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
    void,
    OpenAPIRuntimeContext
>({
    componentId: 'configureSource',
    initialState: (props, _, context) => {
        return {
            specURL: '',
        };
    },
    action: async (element, action, ctx) => {
        return element;
    },
    render: async (element, context) => {
        return (
            <block>
                <input
                    label="Spec URL"
                    hint="Enter the URL of the OpenAPI specification."
                    element={<textinput state="specURL" />}
                />
                <button
                    style="primary"
                    label="Continue"
                    onPress={{
                        action: '@ui.submit',
                        returnValue: {
                            props: {
                                specURL: element.state.specURL,
                            },
                            dependencies: {
                                // Align with GenerateContentSourceDependencies
                                // spec: { kind: 'openapi', spec: element.dynamicState('spec') }
                            },
                        },
                    }}
                />
            </block>
        );
    },
});