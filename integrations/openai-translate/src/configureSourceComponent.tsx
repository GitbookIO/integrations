import { createComponent } from '@gitbook/runtime';

import type { OpenAITranslateRuntimeContext } from './types';

type SourceConfigureProps = {
    
};

/**
 * ContentKit component to configure the GitHub Copilot integration.
 */
export const configureSourceComponent = createComponent<
SourceConfigureProps,
    {},
    void,
    OpenAITranslateRuntimeContext
>({
    componentId: 'configureSource',
    initialState: (props, _, context) => {
        return {}
    },
    render: async (element, context) => {
        return (
            <modal title="Translate content">
                
            </modal>
        );
    },
});
