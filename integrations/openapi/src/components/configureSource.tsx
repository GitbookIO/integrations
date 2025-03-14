import { ConfigureContentSourceProps, createComponent, ExposableError } from '@gitbook/runtime';

import type { OpenAPIRuntimeContext } from '../types';
import type { OpenAPIContentSource } from '../contentSources';

/**
 * ContentKit component to configure the content source.
 */
export const configureComponent = createComponent<
    // @ts-expect-error incompatible with PlainObject
    ConfigureContentSourceProps<OpenAPIContentSource>,
    {
        spec: string | null;
        models: boolean;
    },
    { action: 'submit' } | { action: 'selectSpec'; spec: string },
    OpenAPIRuntimeContext
>({
    componentId: 'configureSource',
    initialState: (props) => {
        if (props.contentSource) {
            return {
                spec: props.contentSource.dependencies.spec.ref.spec,
                models: props.contentSource.props.models,
            };
        }
        return {
            spec: null,
            models: false,
        };
    },
    action: async (element, action, _ctx) => {
        if (action.action === 'submit') {
            if (!element.state.spec) {
                throw new ExposableError('Invalid spec URL');
            }

            return {
                type: 'complete',
                returnValue: {
                    props: {
                        models: element.state.models,
                    },
                    dependencies: {
                        spec: {
                            ref: {
                                kind: 'openapi',
                                spec: element.state.spec,
                            },
                        },
                    },
                },
            };
        }

        if (action.action === 'selectSpec') {
            return {
                ...element,
                state: {
                    ...element.state,
                    spec: action.spec,
                },
            };
        }

        return element;
    },
    render: async (element, context) => {
        const { installation } = context.environment;
        const { state } = element;

        if (!installation) {
            throw new ExposableError('Installation not found');
        }

        return (
            <configuration>
                <input
                    label="OpenAPI Specification"
                    hint="Choose the OpenAPI specification to use."
                    element={
                        <select
                            state="spec"
                            options={{ source: 'openapi' }}
                            onValueChange={{
                                action: 'selectSpec',
                                spec: element.dynamicState('spec'),
                            }}
                        />
                    }
                />
                <divider />
                <input
                    label="Generate models"
                    hint="Generate a models page for all schema components."
                    element={<switch state="models" />}
                />
                <button
                    style="primary"
                    label="Continue"
                    disabled={!state.spec}
                    onPress={{
                        action: 'submit',
                    }}
                />
            </configuration>
        );
    },
});
